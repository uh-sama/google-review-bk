const express = require('express');
const bodyParser = require('body-parser');
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./utils/appError');

const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: false, limit: '25mb' }));

function checkForHTMLTags(req, res, next) {
    const { body } = req;
    const keys = Object.keys(body);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = body[key];

        if (typeof value === 'string' && sanitizeHtml(value) !== value) {
            return res
                .status(400)
                .json({ error: 'HTML tags are not allowed in the request body' });
        }
    }
    next();
};

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 100,
    message: 'To many request from this IP now please wait for an hour!',
    validate: {
        xForwardedForHeader: false
    }
});

app.use(checkForHTMLTags);
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);
app.use(cors(
    {
        origin: ["http://localhost:3000"],
        credentials: true
    }
));

app.use('/api', limiter);
app.use('/api/v1/review', reviewRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.status(400).json({ message: error.message || 'An unknown error occurred' });
});

app.listen(port, () => console.log(`Server started on port ${port}`));

connectDB();
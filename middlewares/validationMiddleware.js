const AppError = require("../utils/appError");

function validationMiddleware(schema) {
    return async (req, res, next) => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        };

        try {
            const value = await schema.validateAsync(req.body, validationOptions);
            req.body = value;
            next();
        } catch (error) {
            const errors = [];
            error.details.forEach(element => {
                errors.push(element.message);
            });
            next(new AppError(JSON.stringify(errors), 400));
        }
    };
}

module.exports = validationMiddleware;


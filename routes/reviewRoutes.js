const express = require('express');

const reviewController = require('../controllers/reviewController');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { getReviewsValidation } = require('../validations/reviewValidations');

const router = express.Router();

router.post('/get-reviews', validationMiddleware(getReviewsValidation), reviewController.getLocationReviews);

module.exports = router;
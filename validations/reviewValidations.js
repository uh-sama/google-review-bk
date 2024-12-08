const Joi = require('joi');

const getReviewsValidation = Joi.object({
    location: Joi.string().required(),
});

exports.getReviewsValidation = getReviewsValidation;
const getPlaceDetails = require("../helpers/getPlaceDetails");
const getReviews = require("../helpers/getReviews");
const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');

const getLocationReviews = async (req, res, next) => {
    try {
        const placeId = await getPlaceDetails(req.body.location);
        const placeReviews = await getReviews(placeId);
        console.log(placeReviews);
        await Review.insertMany(placeReviews);
        res.status(200).json({ message: "Successful", data: placeReviews });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

exports.getLocationReviews = getLocationReviews;
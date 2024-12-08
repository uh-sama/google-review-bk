const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    reviews: [{ type: Object, required: true }],
},
    { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
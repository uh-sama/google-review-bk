const { Client } = require("@googlemaps/google-maps-services-js");
const Sentiment = require("sentiment");
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({});
const sentiment = new Sentiment();

const apiKey = process.env.GOOGLE_API_KEY;

async function getReviews(placeId) {
    try {
        const response = await client.placeDetails({
            params: {
                place_id: placeId,
                key: apiKey,
                fields: "name,rating,reviews",
            },
        });

        if (response.data.status === "OK") {
            const result = response.data.result;

            const reviews = result.reviews
                ? result.reviews.map((review) => {
                    const sentimentResult = sentiment.analyze(review.text);
                    const sentimentScore = sentimentResult.score;
                    let sentimentLabel = "neutral";

                    if (sentimentScore > 0) {
                        sentimentLabel = "positive";
                    } else if (sentimentScore < 0) {
                        sentimentLabel = "negative";
                    }

                    return {
                        author: review.author_name,
                        date: review.relative_time_description,
                        text: review.text,
                        sentiment: sentimentLabel,
                    };
                })
                : [];

            return {
                name: result.name,
                rating: result.rating,
                reviews: reviews,
            };
        } else {
            throw new Error("Failed to get reviews. " + response.data.status);
        }
    } catch (error) {
        throw new Error("Error in getReviews: " + error.message);
    }
}

module.exports = getReviews;

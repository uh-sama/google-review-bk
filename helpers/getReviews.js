const { Client } = require("@googlemaps/google-maps-services-js");
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({});

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
            return {
                name: result.name,
                rating: result.rating,
                reviews: result.reviews || [],
            };
        } else {
            throw new Error("Failed to get reviews. " + response.data.status);
        }
    } catch (error) {
        throw new Error("Error in getReviews: " + error.message);
    }
}

module.exports = getReviews;

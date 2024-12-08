const { Client } = require("@googlemaps/google-maps-services-js");
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({});

const apiKey = process.env.GOOGLE_API_KEY;

async function getPlaceDetails(address) {
    try {
        const response = await client.geocode({
            params: {
                address: address,
                key: apiKey,
            },
        });

        if (
            response.data.status === "OK" &&
            response.data.results.length > 0
        ) {
            return response.data.results[0].place_id;
        } else {
            throw new Error("Failed to get place ID. " + response.data.error_message);
        }
    } catch (error) {
        console.log(error)
        throw new Error("Error in getPlaceId: " + error.message);
    }
}

module.exports = getPlaceDetails;

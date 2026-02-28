const axios = require("axios");

async function getCoordinates(place) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1&addressdetails=1`;

        const response = await axios.get(url, {
            headers: {
                "User-Agent": "AgriTrustAI-App"
            }
        });

        if (!response.data || response.data.length === 0) {
            throw new Error("Location not found");
        }

        return {
            lat: parseFloat(response.data[0].lat),
            lng: parseFloat(response.data[0].lon)
        };

    } catch (error) {
        console.error("Geocoding error:", error.message);
        throw error;
    }
}

module.exports = getCoordinates;
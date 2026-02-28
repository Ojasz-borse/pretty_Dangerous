const axios = require("axios");

async function getRoadDistance(lat1, lon1, lat2, lon2) {
    try {
        const url =
            `http://router.project-osrm.org/route/v1/driving/` +
            `${lon1},${lat1};${lon2},${lat2}` +
            `?overview=false&geometries=geojson&alternatives=false&steps=false`;

        const response = await axios.get(url);

        if (!response.data.routes || response.data.routes.length === 0) {
            throw new Error("Route not found");
        }

        const distanceMeters = response.data.routes[0].distance;
        const durationSeconds = response.data.routes[0].duration;

        return {
            distanceKm: Number((distanceMeters / 1000).toFixed(2)),
            durationHours: Number((durationSeconds / 3600).toFixed(2))
        };

    } catch (error) {
        console.error("OSRM Error:", error.message);
        throw error;
    }
}

module.exports = getRoadDistance;
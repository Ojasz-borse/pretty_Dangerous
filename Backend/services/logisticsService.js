const User = require("../models/User");
const Crop = require("../models/Crop");
const calculateDistance = require("./calculateDistance");
const getCoordinates = require("../utils/geocode");

exports.calculateLogistics = async (cropId, buyerId) => {

  const crop = await Crop.findById(cropId).populate("farmer");
  const buyer = await User.findById(buyerId);

  if (!crop || !buyer) {
    throw new Error("Crop or Buyer not found");
  }

  // If location has no lat/lng → fetch dynamically
  let farmerLocation = crop.farmer.location;
  let buyerLocation = buyer.location;

  if (!farmerLocation.lat || !farmerLocation.lng) {
    farmerLocation = await getCoordinates(
      `${crop.farmer.location.village}, ${crop.farmer.location.district}, India`
    );
  }

  if (!buyerLocation.lat || !buyerLocation.lng) {
    buyerLocation = await getCoordinates(
      `${buyer.location.village}, ${buyer.location.district}, India`
    );
  }

  const getRoadDistance = require("../utils/getRoadDistance");

  const route = await getRoadDistance(
    farmerLocation.lat,
    farmerLocation.lng,
    buyerLocation.lat,
    buyerLocation.lng
  );

  const distance = route.distanceKm;
  const travelTime = route.durationHours;
  const transportCost = distance * 8;
  const storageCost = crop.quantity * 2;
  const expectedRevenue = crop.quantity * (crop.expectedPrice ?? 0);
  const netProfit = expectedRevenue - transportCost - storageCost;

  return {
    distance: distance.toFixed(2),
    transportCost: transportCost.toFixed(2),
    storageCost,
    expectedRevenue,
    netProfit: netProfit.toFixed(2)
  };
};

// NEW: Manual calculation for generic input (from Calculator UI)
exports.calculateManualLogistics = async (cropName, quantity, pickupCity, deliveryCity, pricePerQuintal) => {
  const getRoadDistance = require("../utils/getRoadDistance");
  const axios = require("axios");

  // 1. Geocode cities
  const pickupCoord = await getCoordinates(`${pickupCity}, India`);
  const deliveryCoord = await getCoordinates(`${deliveryCity}, India`);

  // 2. Get Road distance
  const route = await getRoadDistance(pickupCoord.lat, pickupCoord.lng, deliveryCoord.lat, deliveryCoord.lng);

  // 3. Fetch Real-Time Price (Optional/Best Effort)
  let modalPrice = pricePerQuintal;
  try {
    const aiBackend = process.env.AI_BACKEND_URL || "http://localhost:8000";
    const response = await axios.get(`${aiBackend}/data?crop=${cropName}&district=${pickupCity}`);
    if (response.data && response.data.current_price) {
      modalPrice = response.data.current_price.modal_price_quintal;
    }
  } catch (e) {
    console.log("Could not fetch real-time price, using provided price");
  }

  const distance = route.distanceKm;
  const travelTime = route.durationHours;
  const transportCost = distance * 8; // Basic estimation
  const loadingCost = quantity * 5;
  const marketFee = (quantity * modalPrice) * 0.01;
  const totalExpenses = transportCost + loadingCost + marketFee;
  const grossAmount = quantity * modalPrice;
  const netProfit = grossAmount - totalExpenses;

  return {
    pickupLocation: { district: pickupCity, state: "India" },
    deliveryLocation: { district: deliveryCity, state: "India" },
    distance: distance,
    estimatedTime: travelTime,
    netProfitCalculation: {
      cropName,
      quantity,
      pricePerQuintal: modalPrice,
      grossAmount,
      transportCost,
      loadingCost,
      marketFee: Math.round(marketFee),
      otherExpenses: 0,
      totalExpenses,
      netProfit,
      profitMargin: ((netProfit / grossAmount) * 100).toFixed(1)
    }
  };
};
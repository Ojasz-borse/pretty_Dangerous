const User = require("../models/User");
const Crop = require("../models/Crop");
const calculateDistance = require("../utils/calculateDistance");

exports.calculateLogistics = async (cropId, buyerId) => {

  const crop = await Crop.findById(cropId).populate("farmer");
  const buyer = await User.findById(buyerId);

  if (!crop || !buyer) {
    throw new Error("Crop or Buyer not found");
  }

  const farmerLocation = crop.farmer.location;
  const buyerLocation = buyer.location;

  const distance = calculateDistance(
    farmerLocation.lat,
    farmerLocation.lng,
    buyerLocation.lat,
    buyerLocation.lng
  );

  // ₹8 per km transport cost (you can change)
  const transportCost = distance * 8;

  // ₹2 per kg storage assumption
  const storageCost = crop.quantity * 2;

  const expectedRevenue =
    crop.quantity * (crop.expectedPrice || 0);

  const netProfit =
    expectedRevenue - transportCost - storageCost;

  return {
    distance: distance.toFixed(2),
    transportCost: transportCost.toFixed(2),
    storageCost,
    expectedRevenue,
    netProfit: netProfit.toFixed(2)
  };
};
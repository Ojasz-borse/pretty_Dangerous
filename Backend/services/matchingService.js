const Crop = require("../models/Crop");
const User = require("../models/User");

exports.findMatchingCrops = async (filters, buyer) => {

  const { cropName, minQuantity, maxPrice } = filters;

  let query = { status: "available" };

  if (cropName) {
    query.cropName = new RegExp(cropName, "i");
  }

  if (minQuantity) {
    query.quantity = { $gte: minQuantity };
  }

  if (maxPrice) {
    query.expectedPrice = { $lte: maxPrice };
  }

  const crops = await Crop.find(query).populate("farmer");

  // Sort by trust score (high first)
  crops.sort((a, b) => b.farmer.trustScore - a.farmer.trustScore);

  return crops;
};
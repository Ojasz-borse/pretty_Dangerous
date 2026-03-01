const Crop = require("../models/Crop");
const User = require("../models/User");

exports.findMatchingCrops = async (filters, buyer) => {
  const { cropName, minQuantity, maxPrice } = filters;

  let query = { status: "available" };

  if (cropName) {
    if (Array.isArray(cropName)) {
      query.cropName = { $in: cropName.map(n => new RegExp(n, "i")) };
    } else {
      query.cropName = new RegExp(cropName, "i");
    }
  }

  if (minQuantity) {
    query.quantity = { $gte: parseFloat(minQuantity) };
  }

  if (maxPrice) {
    query.expectedPrice = { $lte: parseFloat(maxPrice) };
  }

  let crops = await Crop.find(query).populate("farmer");

  // Filter out crops where farmer might be missing
  crops = crops.filter(c => c && c.farmer);

  // Sort by trust score (high first)
  crops.sort((a, b) => ((b.farmer && b.farmer.trustScore) || 0) - ((a.farmer && a.farmer.trustScore) || 0));

  return crops;
};
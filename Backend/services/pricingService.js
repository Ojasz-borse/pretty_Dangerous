const Crop = require("../models/Crop");

exports.getFairPrice = async (cropId) => {

  const crop = await Crop.findById(cropId);
  if (!crop) throw new Error("Crop not found");

  const basePrice = crop.expectedPrice || 0;

  // Simulated demand index
  const demandIndex = Math.floor(Math.random() * 40) + 60;

  // Risk simulation
  const volatility = Math.random();
  let riskImpact = 0;

  if (volatility > 0.7) riskImpact = -0.05; // high risk
  else if (volatility > 0.4) riskImpact = -0.02;

  const demandImpact = demandIndex * 0.002; // 0.2% per demand unit

  const adjustedPrice =
    basePrice + (basePrice * demandImpact) + (basePrice * riskImpact);

  const fairPriceMin = adjustedPrice * 0.95;
  const fairPriceMax = adjustedPrice * 1.05;

  return {
    basePrice,
    fairPriceMin: fairPriceMin.toFixed(2),
    fairPriceMax: fairPriceMax.toFixed(2),
    recommendedOffer: adjustedPrice.toFixed(2),
    marketReason: {
      demandIndex,
      riskImpact: (riskImpact * 100).toFixed(1) + "%",
      demandImpact: (demandImpact * 100).toFixed(1) + "%"
    }
  };
};
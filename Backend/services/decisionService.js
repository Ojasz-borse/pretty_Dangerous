const Crop = require("../models/Crop");

exports.getDecision = async (cropId) => {

  const crop = await Crop.findById(cropId);
  if (!crop) throw new Error("Crop not found");

  const currentPrice = crop.expectedPrice || 0;

  // Simulated prediction (later replace with ML)
  const predictedPrice = currentPrice * 1.08; // +8%

  // Simulated demand index (0–100)
  const demandIndex = Math.floor(Math.random() * 40) + 60;

  // Risk based on volatility simulation
  const volatility = Math.random();

  let riskLevel = "Low";
  if (volatility > 0.7) riskLevel = "High";
  else if (volatility > 0.4) riskLevel = "Medium";

  const recommendation =
    predictedPrice > currentPrice ? "WAIT" : "SELL";

  return {
    currentPrice,
    predictedPrice: predictedPrice.toFixed(2),
    demandIndex,
    riskLevel,
    recommendation,
    explanation: {
      demandImpact: "+3%",
      seasonalImpact: "+2%",
      supplyImpact: "+3%"
    }
  };
};
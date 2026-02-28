const Crop = require("../models/Crop");

exports.getDecision = async (cropId) => {
  const crop = await Crop.findById(cropId);
  if (!crop) throw new Error("Crop not found");

  const currentPrice = crop.expectedPrice ?? 0;

  // Use NULLISH operator (important fix)
  const demandIndex = crop.demandIndex ?? 75;
  const seasonalFactor = crop.seasonalFactor ?? 1.05;
  const volatilityIndex = crop.volatilityIndex ?? 0.3;

  // ---- Price Prediction ----
  const demandImpact = (demandIndex - 50) / 100;

  const predictedPrice =
    currentPrice *
    (1 + demandImpact * 0.1) *
    seasonalFactor;

  // ---- Risk Level ----
  let riskLevel = "Low";
  if (volatilityIndex > 0.7) riskLevel = "High";
  else if (volatilityIndex > 0.4) riskLevel = "Medium";

  const growthPercentage =
    currentPrice === 0
      ? 0
      : ((predictedPrice - currentPrice) / currentPrice) * 100;

  // ---- Decision Logic ----
  let recommendation = "SELL";
  let summary = "";

  if (riskLevel === "High") {
    recommendation = "SELL";
    summary = "High market volatility detected. Selling now reduces financial risk.";
  }
  else if (growthPercentage >= 5 && demandIndex >= 70) {
    recommendation = "WAIT";
    summary = "Strong demand and price growth expected. Waiting may increase profit.";
  }
  else if (growthPercentage >= 2) {
    recommendation = "WAIT";
    summary = "Moderate price growth expected. Holding for short term may benefit.";
  }
  else {
    recommendation = "SELL";
    summary = "Price growth is limited. Selling now secures stable income.";
  }

  return {
    currentPrice,
    predictedPrice: predictedPrice.toFixed(2),
    demandIndex,
    riskLevel,
    growthPercentage: growthPercentage.toFixed(2),
    recommendation,
    explanation: summary
  };
};
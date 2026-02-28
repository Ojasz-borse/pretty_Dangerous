const logisticsService = require("../services/logisticsService");

exports.calculate = async (req, res) => {
  try {
    const { cropId } = req.query;

    const buyerId = req.user.id;

    const result = await logisticsService.calculateLogistics(
      cropId,
      buyerId
    );

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.calculateManual = async (req, res) => {
  try {
    const { cropName, quantity, pickupCity, deliveryCity, pricePerQuintal } = req.body;

    const result = await logisticsService.calculateManualLogistics(
      cropName,
      parseFloat(quantity),
      pickupCity,
      deliveryCity,
      parseFloat(pricePerQuintal)
    );

    res.json({
      success: true,
      data: result,
      message: "Logistics calculated successfully"
    });

  } catch (error) {
    console.error("Manual Calc Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
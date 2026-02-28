const pricingService = require("../services/pricingService");

exports.getFairPrice = async (req, res) => {
  try {
    const { cropId } = req.query;

    const result = await pricingService.getFairPrice(cropId);

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
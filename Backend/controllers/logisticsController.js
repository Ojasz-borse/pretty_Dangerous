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
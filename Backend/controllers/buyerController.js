const matchingService = require("../services/matchingService");

exports.searchCrops = async (req, res) => {
  try {
    const filters = {
      cropName: req.query.cropName,
      minQuantity: req.query.minQuantity,
      maxPrice: req.query.maxPrice
    };

    const buyer = req.user;

    const crops = await matchingService.findMatchingCrops(filters, buyer);

    res.json({
      total: crops.length,
      crops
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
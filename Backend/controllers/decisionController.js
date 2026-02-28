const decisionService = require("../services/decisionService");

exports.getRecommendation = async (req, res) => {
  try {
    const { cropId } = req.query;

    const result = await decisionService.getDecision(cropId);

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
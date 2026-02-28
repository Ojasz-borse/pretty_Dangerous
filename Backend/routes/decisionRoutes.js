// routes/decisionRoute.js

const express = require("express");
const router = express.Router();
const { getDecision } = require("../services/decisionService");

router.get("/:cropId", async (req, res) => {
  try {
    const result = await getDecision(req.params.cropId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
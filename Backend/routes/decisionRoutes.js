const express = require("express");
const router = express.Router();

const decisionController = require("../controllers/decisionController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get(
  "/recommendation",
  authMiddleware,
  roleMiddleware("farmer"),
  decisionController.getRecommendation
);

module.exports = router;
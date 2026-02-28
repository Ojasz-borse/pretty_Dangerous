const express = require("express");
const router = express.Router();

const pricingController = require("../controllers/pricingController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get(
  "/fair-price",
  authMiddleware,
  roleMiddleware("buyer"),
  pricingController.getFairPrice
);

module.exports = router;
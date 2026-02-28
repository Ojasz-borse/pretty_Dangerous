const express = require("express");
const router = express.Router();

const logisticsController = require("../controllers/logisticsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/calculate",
  authMiddleware,
  logisticsController.calculate
);

router.post(
  "/manual-calculate",
  logisticsController.calculateManual
);

module.exports = router;
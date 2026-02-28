const express = require("express");
const router = express.Router();

const buyerController = require("../controllers/buyerController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get(
  "/search",
  authMiddleware,
  roleMiddleware("buyer"),
  buyerController.searchCrops
);

module.exports = router;
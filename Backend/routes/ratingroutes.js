const express = require("express");
const router = express.Router();

const ratingController = require("../controllers/ratingController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/submit",
  authMiddleware,
  ratingController.submitRating
);

module.exports = router;
const express = require("express");
const router = express.Router();

const farmerController = require("../controllers/farmerController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");


// Only farmers allowed
router.post(
  "/crop",
  authMiddleware,
  roleMiddleware("farmer"),
  farmerController.createCrop
);

router.get(
  "/my-crops",
  authMiddleware,
  roleMiddleware("farmer"),
  farmerController.getMyCrops
);

router.put(
  "/crop/:id",
  authMiddleware,
  roleMiddleware("farmer"),
  farmerController.updateCrop
);

router.delete(
  "/crop/:id",
  authMiddleware,
  roleMiddleware("farmer"),
  farmerController.deleteCrop
);

module.exports = router;
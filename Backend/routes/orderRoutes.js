const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");


// Buyer creates order
router.post(
  "/",
  authMiddleware,
  roleMiddleware("buyer"),
  orderController.createOrder
);


// Farmer views orders
router.get(
  "/farmer",
  authMiddleware,
  roleMiddleware("farmer"),
  orderController.getFarmerOrders
);


// Buyer views own orders
router.get(
  "/buyer",
  authMiddleware,
  roleMiddleware("buyer"),
  orderController.getBuyerOrders
);


// Farmer updates order
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("farmer"),
  orderController.updateOrderStatus
);

module.exports = router;
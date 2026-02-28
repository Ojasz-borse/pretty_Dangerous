const Order = require("../models/Order");
const trustService = require("../services/trustService");

exports.submitRating = async (req, res) => {
  try {
    const { orderId, rating } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "completed") {
      return res.status(400).json({ message: "Order not completed yet" });
    }

    // Buyer rating farmer
    if (req.user.role === "buyer") {
      order.buyerRating = rating;
      await trustService.updateTrustScore(order.farmer, rating);
    }

    // Farmer rating buyer
    if (req.user.role === "farmer") {
      order.farmerRating = rating;
      await trustService.updateTrustScore(order.buyer, rating);
    }

    await order.save();

    res.json({ message: "Rating submitted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Order = require("../models/Order");
const Crop = require("../models/Crop");


// 🛒 Buyer places order
exports.createOrder = async (req, res) => {
  try {
    const { cropId, quantity, pricePerUnit } = req.body;

    const crop = await Crop.findById(cropId);
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    const totalAmount = quantity * pricePerUnit;

    const order = await Order.create({
      crop: cropId,
      farmer: crop.farmer,
      buyer: req.user.id,
      quantity,
      pricePerUnit,
      totalAmount
    });

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 👨‍🌾 Farmer views incoming orders
exports.getFarmerOrders = async (req, res) => {
  const orders = await Order.find({ farmer: req.user.id })
    .populate("buyer crop");

  res.json(orders);
};


// 🛒 Buyer views own orders
exports.getBuyerOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user.id })
    .populate("crop farmer");

  res.json(orders);
};


// 👨‍🌾 Accept / Reject
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(order);
};
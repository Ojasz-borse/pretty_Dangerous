const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crop",
    required: true
  },

  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  pricePerUnit: Number,
  quantity: Number,

  totalAmount: Number,

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending"
  },

  buyerRating: { type: Number, min: 1, max: 5 },
  farmerRating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
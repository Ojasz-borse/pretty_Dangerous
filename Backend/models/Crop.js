const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  cropName: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  unit: {
    type: String,
    enum: ["kg", "ton"],
    default: "kg",
  },

  expectedPrice: {
    type: Number,
  },

  harvestDate: {
    type: Date,
  },

  availability: {
    type: String,
    enum: ["immediate", "scheduled"],
    default: "immediate",
  },

  status: {
    type: String,
    enum: ["available", "sold"],
    default: "available",
  },

}, { timestamps: true });

module.exports = mongoose.model("Crop", cropSchema);
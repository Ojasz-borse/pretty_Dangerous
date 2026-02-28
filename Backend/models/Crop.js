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
  variety: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ["kg", "quintal", "ton", "Quintals"],
    default: "kg",
  },
  expectedPrice: {
    type: Number,
  },
  quality: {
    type: String,
    default: "A Grade",
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  location: {
    district: String,
    state: String,
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
    enum: ["available", "sold", "listed"],
    default: "available",
  },

}, { timestamps: true });

module.exports = mongoose.model("Crop", cropSchema);
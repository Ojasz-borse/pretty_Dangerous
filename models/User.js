const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["farmer", "buyer"],
    required: true,
  },

  buyerType: {
    type: String,
    enum: ["consumer", "retailer", "institution"],
  },

  location: {
    district: String,
    state: String,
    lat: Number,
    lng: Number,
  },

  trustScore: {
    type: Number,
    default: 50,
  },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
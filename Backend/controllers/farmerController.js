const Crop = require("../models/Crop");


// 🌾 Create Crop Listing
exports.createCrop = async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      unit,
      expectedPrice,
      harvestDate,
      availability
    } = req.body;

    const crop = await Crop.create({
      farmer: req.user.id,
      cropName,
      quantity,
      unit,
      expectedPrice,
      harvestDate,
      availability
    });

    res.status(201).json({
      message: "Crop listed successfully",
      crop
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🌾 Get Farmer's Crops
exports.getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id });

    res.json(crops);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🌾 Update Crop
exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      req.body,
      { new: true }
    );

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json({
      message: "Crop updated",
      crop
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🌾 Delete Crop
exports.deleteCrop = async (req, res) => {
  try {
    await Crop.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user.id
    });

    res.json({ message: "Crop deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
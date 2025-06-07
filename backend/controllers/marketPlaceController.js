// backend/controllers/marketplaceController.js
const MarketplaceItem = require("../models/MarketPlaceItem");

// @desc    Add a new marketplace item
// @route   POST /api/marketplace
// @access  Private
exports.addItem = async (req, res) => {
  const { userId, title, description, category, price, contactInfo, images } = req.body;
  try {
    const newItem = new MarketplaceItem({ userId, title, description, category, price, contactInfo, images });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all marketplace items
// @route   GET /api/marketplace
// @access  Public
exports.getAllItems = async (req, res) => {
  try {
    const items = await MarketplaceItem.find().populate("userId", "email");
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/marketplace/:id
// @access  Private
exports.deleteItem = async (req, res) => {
  try {
    const removed = await MarketplaceItem.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

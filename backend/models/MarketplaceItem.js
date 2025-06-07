// backend/models/MarketplaceItem.js
const mongoose = require("mongoose");

const MarketplaceItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // e.g., “Tool”, “Book”, “Clothing”, etc.
  price: { type: Number, required: true },
  contactInfo: { type: String, required: true }, // How to reach seller
  images: [{ type: String }], // URLs or base64 strings
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MarketplaceItem", MarketplaceItemSchema);

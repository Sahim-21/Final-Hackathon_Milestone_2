// backend/routes/marketplace.js
const express = require("express");
const router = express.Router();
const {
  addItem,
  getAllItems,
  deleteItem,
} = require("../controllers/marketplaceController");

// POST /api/marketplace
router.post("/", addItem);

// GET /api/marketplace
router.get("/", getAllItems);

// DELETE /api/marketplace/:id
router.delete("/:id", deleteItem);

module.exports = router;

// backend/routes/schemes.js
const express = require("express");
const router = express.Router();
const {
  getAllSchemes,
  createScheme,
  getSchemeById,
  updateScheme,
  deleteScheme,
} = require("../controllers/schemeController");

// GET /api/schemes
router.get("/", getAllSchemes);

// POST /api/schemes   (In production, protect to admin only)
router.post("/", createScheme);

// GET /api/schemes/:id
router.get("/:id", getSchemeById);

// PUT /api/schemes/:id   (Admin)
router.put("/:id", updateScheme);

// DELETE /api/schemes/:id   (Admin)
router.delete("/:id", deleteScheme);

module.exports = router;

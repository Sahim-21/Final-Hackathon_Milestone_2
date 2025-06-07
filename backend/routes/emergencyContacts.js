// backend/routes/emergencyContacts.js
const express = require("express");
const router = express.Router();
const {
  addContact,
  getUserContacts,
  deleteContact,
} = require("../controllers/emergencyController");

// POST /api/emergency
router.post("/", addContact);

// GET /api/emergency/user/:userId
router.get("/user/:userId", getUserContacts);

// DELETE /api/emergency/:id
router.delete("/:id", deleteContact);

module.exports = router;

// backend/routes/chatbot.js
const express = require("express");
const router = express.Router();
const { getEligibleSchemes } = require("../controllers/chatbotController");

// POST /api/chatbot/eligible-schemes
router.post("/eligible-schemes", getEligibleSchemes);

module.exports = router;

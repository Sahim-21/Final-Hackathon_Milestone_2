// backend/routes/grievances.js
const express = require("express");
const router = express.Router();
const {
  submitGrievance,
  getAllGrievances,
  getUserGrievances,
} = require("../controllers/grievanceController");

// POST /api/grievances
router.post("/", submitGrievance);

// GET /api/grievances      (Admin: see all)
router.get("/", getAllGrievances);

// GET /api/grievances/user/:userId
router.get("/user/:userId", getUserGrievances);

module.exports = router;

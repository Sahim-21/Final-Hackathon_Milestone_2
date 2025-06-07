// backend/controllers/grievanceController.js
const Grievance = require("../models/Grievance");

// @desc    Submit a new grievance
// @route   POST /api/grievances
// @access  Private (user must be logged in)
exports.submitGrievance = async (req, res) => {
  const { userId, subject, description } = req.body;
  try {
    const newGrievance = new Grievance({ userId, subject, description });
    const saved = await newGrievance.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all grievances
// @route   GET /api/grievances
// @access  Admin (or maybe user sees only their own)
exports.getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find().populate("userId", "email role");
    res.json(grievances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get grievances for a specific user
// @route   GET /api/grievances/user/:userId
// @access  Private
exports.getUserGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ userId: req.params.userId });
    res.json(grievances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

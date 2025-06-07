// backend/controllers/schemeController.js
const Scheme = require("../models/Scheme");

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public
exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new scheme
// @route   POST /api/schemes
// @access  Admin (in a real app, protect this route)
exports.createScheme = async (req, res) => {
  try {
    const newScheme = new Scheme(req.body);
    const saved = await newScheme.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get a scheme by ID
// @route   GET /api/schemes/:id
// @access  Public
exports.getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });
    res.json(scheme);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a scheme
// @route   PUT /api/schemes/:id
// @access  Admin
exports.updateScheme = async (req, res) => {
  try {
    const updated = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Scheme not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a scheme
// @route   DELETE /api/schemes/:id
// @access  Admin
exports.deleteScheme = async (req, res) => {
  try {
    const removed = await Scheme.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Scheme not found" });
    res.json({ message: "Scheme deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get eligible schemes based on user criteria
// @route   POST /api/chatbot/eligible-schemes
// @access  Public
exports.getEligibleSchemes = async (req, res) => {
  const { age, status, rank } = req.body;
  try {
    // Find schemes where age min ≤ age ≤ age max AND status array contains user's status AND rank array contains user's rank
    const matches = await Scheme.find({
      "eligibility.age.min": { $lte: age },
      "eligibility.age.max": { $gte: age },
      "eligibility.status": status,
      "eligibility.rank": rank,
    });
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

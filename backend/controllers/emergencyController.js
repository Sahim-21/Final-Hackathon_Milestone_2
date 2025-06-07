// backend/controllers/emergencyController.js
const EmergencyContact = require("../models/EmergencyContact");

// @desc    Add new emergency contact
// @route   POST /api/emergency
// @access  Private
exports.addContact = async (req, res) => {
  const { userId, name, relationship, phone, address } = req.body;
  try {
    const newContact = new EmergencyContact({ userId, name, relationship, phone, address });
    const saved = await newContact.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all contacts for a user
// @route   GET /api/emergency/user/:userId
// @access  Private
exports.getUserContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ userId: req.params.userId });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a contact
// @route   DELETE /api/emergency/:id
// @access  Private
exports.deleteContact = async (req, res) => {
  try {
    const removed = await EmergencyContact.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

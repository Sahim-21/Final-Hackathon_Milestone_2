// backend/models/Grievance.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const GrievanceSchema = new mongoose.Schema({
  grievanceId: { type: String, default: uuidv4, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Resolved", "In Progress"] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Grievance", GrievanceSchema);

// backend/models/Scheme.js
const mongoose = require("mongoose");

const SchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  eligibility: {
    age: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    status: [{ type: String, enum: ["serving", "retired", "ex-serviceman"] }],
    rank: [{ type: String, enum: ["officer", "jawan", "NCO", "VCO"] }],
  },
  benefits: { type: String },
  applicationProcess: { type: String },
});

module.exports = mongoose.model("Scheme", SchemeSchema);

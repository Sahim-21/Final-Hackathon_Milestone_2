// backend/controllers/chatbotController.js
/**
 * This controller handles the “eligible‐schemes” endpoint.
 * It expects:
 *   { age: Number, status: "serving"/"retired"/"ex-serviceman", rank: String }
 * Returns:
 *   An array of schemes that match those criteria.
 */
const Scheme = require("../models/Scheme");

exports.getEligibleSchemes = async (req, res) => {
  const { age, status, rank } = req.body;
  if (age == null || !status || !rank) {
    return res.status(400).json({ message: "age, status, and rank are required" });
  }

  try {
    const matchingSchemes = await Scheme.find({
      "eligibility.age.min": { $lte: age },
      "eligibility.age.max": { $gte: age },
      "eligibility.status": status,
      "eligibility.rank": rank,
    });
    res.json(matchingSchemes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

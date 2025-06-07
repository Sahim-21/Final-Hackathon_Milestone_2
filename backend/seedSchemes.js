// backend/seedSchemes.js

const mongoose = require("mongoose");
require("dotenv").config();             // so we can read MONGO_URI from .env
const Scheme = require("./models/Scheme");

// 1. Define the schemes to insert:
const seedData = [
  {
    name: "Prime Minister's Scholarship Scheme (PMSS)",
    description:
      "Scholarships for dependent wards of ex-servicemen and widows to pursue professional and technical education.",
    eligibility: {
      age: { min: 18, max: 28 },
      status: ["ex-serviceman"],
      rank: ["officer", "jawan", "NCO", "VCO"],
    },
    benefits:
      "Monthly stipend of ₹2,500 to ₹3,000 for duration of course (max 4 years).",
    applicationProcess:
      "Apply online via the official PMSS portal with required documents.",
  },
  {
    name: "Armed Forces Flag Day Fund (AFFDF)",
    description:
      "Financial aid for treatment of serious diseases and rehabilitation of serving/retired personnel.",
    eligibility: {
      age: { min: 18, max: 65 },
      status: ["serving", "retired"],
      rank: ["officer", "jawan", "NCO", "VCO"],
    },
    benefits:
      "One-time grant up to ₹50,000 for treatment of critical ailments, rehabilitation support.",
    applicationProcess:
      "Submit application through unit welfare officer with medical documents.",
  },
  {
    name: "Raksha Mantri Ex-Servicemen Welfare Fund (RMEWF)",
    description:
      "Supports various welfare and rehabilitation schemes for ex-servicemen and their dependents.",
    eligibility: {
      age: { min: 21, max: 60 },
      status: ["ex-serviceman"],
      rank: ["officer", "jawan", "NCO", "VCO"],
    },
    benefits:
      "Financial assistance for education of children, vocational training, and housing support.",
    applicationProcess:
      "Download form from RMEWF portal and submit via ZSB office.",
  },
  {
    name: "One Rank One Pension (OROP)",
    description:
      "Ensures uniform pension to retired personnel of the same rank and length of service.",
    eligibility: {
      age: { min: 50, max: 75 },
      status: ["retired", "ex-serviceman"],
      rank: ["officer", "jawan", "NCO", "VCO"],
    },
    benefits:
      "Pension enhanced to OROP rates, plus arrears if applicable.",
    applicationProcess:
      "Apply through PCDA (Pension) website with pension details and rank proof.",
  },
  {
    name: "Central Government Health Scheme (CGHS)",
    description:
      "Comprehensive healthcare facilities for central government employees and pensioners, including armed forces.",
    eligibility: {
      age: { min: 18, max: 70 },
      status: ["serving", "retired", "ex-serviceman"],
      rank: ["officer", "jawan", "NCO", "VCO"],
    },
    benefits:
      "Free OPD, medicines, diagnostic services, hospitalization in CGHS-accredited hospitals.",
    applicationProcess:
      "Enroll at nearest CGHS office with ID proof and pension/employee certificate.",
  },
];

// 2. Connect to MongoDB, clear old data, then insert these:
const seed = async () => {
  try {
    // a) Connect using the MONGO_URI from your .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔗 MongoDB connected for seeding.");

    // b) Remove any existing schemes (optional, but ensures no duplicates)
    await Scheme.deleteMany({});
    console.log("🧹 Cleared existing schemes.");

    // c) Insert our seedData array
    const created = await Scheme.insertMany(seedData);
    console.log(`✅ Inserted ${created.length} schemes.`);
    process.exit(); // exit when done
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    process.exit(1);
  }
};

seed();

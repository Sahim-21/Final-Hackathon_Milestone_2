// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/auth");
const schemeRoutes = require("./routes/schemes");
const grievanceRoutes = require("./routes/grievances");
const emergencyRoutes = require("./routes/emergencyContacts");
const marketplaceRoutes = require("./routes/marketplace");
const chatbotRoutes = require("./routes/chatbot");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/chatbot", chatbotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

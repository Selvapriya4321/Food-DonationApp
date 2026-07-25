const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const donationRoutes = require("./routes/donationRoutes");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");

// Home Route
app.get("/", (req, res) => {
    res.send("🍱 Food Donation API is Running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

module.exports = app;
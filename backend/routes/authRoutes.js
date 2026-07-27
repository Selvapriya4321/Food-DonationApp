const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { get, run, query } = require("../config/db");

const router = express.Router();

// ===== REGISTER =====
router.post("/register", async (req, res) => {
    try {
        const { FullName, Email, Phone, Password, Role } = req.body;

        console.log("📝 Register:", { FullName, Email });

        // Check if user exists
        const existing = await get(
            "SELECT * FROM Users WHERE Email = ?",
            [Email]
        );

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Insert user
        const result = await run(
            `INSERT INTO Users (FullName, Email, Phone, Password, Role, CreatedAt)
             VALUES (?, ?, ?, ?, ?, datetime('now'))`,
            [FullName, Email, Phone || "", hashedPassword, Role || "Donor"]
        );

        // Get user
        const user = await get(
            "SELECT UserID, FullName, Email, Phone, Role FROM Users WHERE UserID = ?",
            [result.lastID]
        );

        // Generate token
        const token = jwt.sign(
            {
                userId: user.UserID,
                email: user.Email,
                fullName: user.FullName,
                role: user.Role
            },
            process.env.JWT_SECRET || "mySecretKey123",
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            token: token,
            user: user
        });

    } catch (err) {
        console.error("❌ Register error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;

        console.log("🔐 Login attempt:", { Email });

        // Get user from SQLite
        const user = await get(
            "SELECT * FROM Users WHERE Email = ?",
            [Email]
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.UserID,
                email: user.Email,
                fullName: user.FullName,
                role: user.Role
            },
            process.env.JWT_SECRET || "mySecretKey123",
            { expiresIn: "7d" }
        );

        console.log("✅ Login successful:", { Email });

        res.json({
            success: true,
            message: "Login Successful",
            token: token,
            user: {
                UserID: user.UserID,
                FullName: user.FullName,
                Email: user.Email,
                Phone: user.Phone,
                Role: user.Role
            }
        });

    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ===== FORGOT PASSWORD =====
router.post("/forgot-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await get(
            "SELECT * FROM Users WHERE Email = ?",
            [email]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not found"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await run(
            "UPDATE Users SET Password = ? WHERE Email = ?",
            [hashedPassword, email]
        );

        res.json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (err) {
        console.error("❌ Forgot password error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ===== GET PROFILE (Protected) =====
router.get("/profile", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "mySecretKey123");
        
        const user = await get(
            "SELECT UserID, FullName, Email, Phone, Role FROM Users WHERE UserID = ?",
            [decoded.userId]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error("❌ Profile error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
});

module.exports = router;
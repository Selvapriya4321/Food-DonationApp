const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const { get, run, query } = require("../config/db");

const router = express.Router();

// ===== PUBLIC ROUTES (No auth needed) =====

// Register
router.post("/register", async (req, res) => {
    try {
        const { FullName, Email, Phone, Password, Role } = req.body;

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
        console.error("Register error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;

        const user = await get(
            "SELECT * FROM Users WHERE Email = ?",
            [Email]
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const match = await bcrypt.compare(Password, user.Password);
        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });
        }

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
        console.error("Login error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Forgot password
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
        console.error("Forgot password error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// ===== PROTECTED ROUTES (Auth required) =====

// Get profile (requires auth)
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        // req.user is available from middleware
        const user = await get(
            "SELECT UserID, FullName, Email, Phone, Role FROM Users WHERE UserID = ?",
            [req.user.userId]
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
        console.error("Profile error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update profile (requires auth)
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { FullName, Phone } = req.body;

        await run(
            "UPDATE Users SET FullName = ?, Phone = ? WHERE UserID = ?",
            [FullName, Phone, req.user.userId]
        );

        res.json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Change password (requires auth)
router.put("/change-password", authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await get(
            "SELECT Password FROM Users WHERE UserID = ?",
            [req.user.userId]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.Password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await run(
            "UPDATE Users SET Password = ? WHERE UserID = ?",
            [hashedPassword, req.user.userId]
        );

        res.json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ===== ADMIN ROUTES (Requires auth + admin role) =====

// Get all users (admin only)
router.get("/users", authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        const users = await query(
            "SELECT UserID, FullName, Email, Phone, Role, CreatedAt FROM Users ORDER BY CreatedAt DESC"
        );

        res.json({
            success: true,
            users: users
        });

    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete user (admin only)
router.delete("/users/:id", authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        const userId = req.params.id;

        const user = await get(
            "SELECT * FROM Users WHERE UserID = ?",
            [userId]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await run(
            "DELETE FROM Users WHERE UserID = ?",
            [userId]
        );

        res.json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
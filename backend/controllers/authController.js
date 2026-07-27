const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, run, get } = require('../config/db');

// ============================================
// REGISTER USER
// ============================================

const register = async (req, res) => {
    try {
        const { FullName, Email, Phone, Password, Role } = req.body;

        console.log('📝 Registration attempt:', { FullName, Email, Role });

        // Validate input
        if (!FullName || !Email || !Password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide FullName, Email, and Password',
                requestId: req.requestId
            });
        }

        // Check if user exists
        const existingUser = await get(
            'SELECT * FROM Users WHERE Email = ?',
            [Email]
        );

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
                requestId: req.requestId
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // Insert user
        const result = await run(
            `INSERT INTO Users (FullName, Email, Phone, Password, Role, CreatedAt) 
             VALUES (?, ?, ?, ?, ?, datetime('now'))`,
            [FullName, Email, Phone || null, hashedPassword, Role || 'Donor']
        );

        // Get the inserted user
        const user = await get(
            'SELECT UserID, FullName, Email, Phone, Role, CreatedAt FROM Users WHERE UserID = ?',
            [result.lastID]
        );

        // Generate token
        const token = jwt.sign(
            { UserID: user.UserID, Email: user.Email, Role: user.Role },
            process.env.JWT_SECRET || 'mySecretKey123',
            { expiresIn: '7d' }
        );

        console.log('✅ User registered successfully:', { UserID: user.UserID, Email: user.Email });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                UserID: user.UserID,
                FullName: user.FullName,
                Email: user.Email,
                Phone: user.Phone,
                Role: user.Role,
                CreatedAt: user.CreatedAt
            },
            requestId: req.requestId
        });

    } catch (error) {
        console.error('❌ Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            requestId: req.requestId
        });
    }
};

// ============================================
// LOGIN USER
// ============================================

const login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        console.log('🔐 Login attempt:', { Email });

        if (!Email || !Password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Email and Password',
                requestId: req.requestId
            });
        }

        // Get user
        const user = await get(
            'SELECT * FROM Users WHERE Email = ?',
            [Email]
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
                requestId: req.requestId
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
                requestId: req.requestId
            });
        }

        // Generate token
        const token = jwt.sign(
            { UserID: user.UserID, Email: user.Email, Role: user.Role },
            process.env.JWT_SECRET || 'mySecretKey123',
            { expiresIn: '7d' }
        );

        // Remove password from response
        delete user.Password;

        console.log('✅ Login successful:', { Email });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                UserID: user.UserID,
                FullName: user.FullName,
                Email: user.Email,
                Phone: user.Phone,
                Role: user.Role,
                CreatedAt: user.CreatedAt
            },
            requestId: req.requestId
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            requestId: req.requestId
        });
    }
};

// ============================================
// GET CURRENT USER
// ============================================

const getCurrentUser = async (req, res) => {
    try {
        const user = await get(
            `SELECT UserID, FullName, Email, Phone, Role, CreatedAt
             FROM Users
             WHERE UserID = ?`,
            [req.user.UserID]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                requestId: req.requestId
            });
        }

        res.json({
            success: true,
            user,
            requestId: req.requestId
        });

    } catch (error) {
        console.error('❌ Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            requestId: req.requestId
        });
    }
};

// ============================================
// GET ALL USERS (Admin only)
// ============================================

const getAllUsers = async (req, res) => {
    try {
        const users = await query(
            'SELECT UserID, FullName, Email, Phone, Role, CreatedAt FROM Users ORDER BY CreatedAt DESC'
        );

        res.json({
            success: true,
            users,
            requestId: req.requestId
        });

    } catch (error) {
        console.error('❌ Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            requestId: req.requestId
        });
    }
};

module.exports = { register, login, getCurrentUser, getAllUsers };
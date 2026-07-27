const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

// ============================================
// 1. USER ROUTES (Protected)
// ============================================

// Get current user profile
router.get('/profile', auth, asyncHandler(getProfile));

// Update user profile
router.put('/profile', auth, asyncHandler(updateProfile));

// Change password
router.put('/change-password', auth, asyncHandler(changePassword));

// Delete account
router.delete('/account', auth, asyncHandler(deleteAccount));

// ============================================
// 2. ADMIN ROUTES
// ============================================

// Get all users (admin only)
router.get('/', auth, asyncHandler(getAllUsers));

// Get user by ID (admin only)
router.get('/:id', auth, asyncHandler(getUserById));

// Update user (admin only)
router.put('/:id', auth, asyncHandler(updateUser));

// Delete user (admin only)
router.delete('/:id', auth, asyncHandler(deleteUser));

module.exports = router;
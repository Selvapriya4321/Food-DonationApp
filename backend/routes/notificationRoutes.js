const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const {
    createNotification,
    getUserNotifications,
    getNotificationById,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
} = require('../controllers/notificationController');

// ============================================
// 1. USER NOTIFICATIONS (Protected)
// ============================================

// Get user notifications
router.get('/', auth, asyncHandler(getUserNotifications));

// Get unread count
router.get('/unread-count', auth, asyncHandler(getUnreadCount));

// Get notification by ID
router.get('/:id', auth, asyncHandler(getNotificationById));

// ============================================
// 2. NOTIFICATION ACTIONS (Protected)
// ============================================

// Mark notification as read
router.put('/:id/read', auth, asyncHandler(markAsRead));

// Mark all as read
router.put('/mark-all-read', auth, asyncHandler(markAllAsRead));

// Delete notification
router.delete('/:id', auth, asyncHandler(deleteNotification));

// ============================================
// 3. ADMIN ONLY - Create notification
// ============================================

router.post('/', auth, asyncHandler(createNotification));

module.exports = router;
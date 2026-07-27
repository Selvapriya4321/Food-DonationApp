const { sql, poolPromise, getOne, getAll, insert } = require('../config/db');

// ============================================
// 1. CREATE NOTIFICATION
// ============================================

const createNotification = async (req, res) => {
    try {
        const { UserID, Title, Message } = req.body;

        if (!UserID || !Message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide UserID and Message',
                requestId: req.requestId
            });
        }

        const notificationID = await insert(
            `INSERT INTO Notifications (UserID, Title, Message, Read, CreatedAt)
             OUTPUT INSERTED.NotificationID
             VALUES (@UserID, @Title, @Message, 0, GETDATE())`,
            {
                UserID: UserID,
                Title: Title || 'New Notification',
                Message: Message
            }
        );

        const notification = await getOne(
            `SELECT * FROM Notifications WHERE NotificationID = @NotificationID`,
            { NotificationID: notificationID }
        );

        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            notification,
            requestId: req.requestId
        });
    } catch (error) {
        console.error('Create notification error:', error);
        throw error;
    }
};

// ============================================
// 2. GET USER NOTIFICATIONS
// ============================================

const getUserNotifications = async (req, res) => {
    try {
        const userID = req.user.UserID;
        const { unread } = req.query;

        let query = `
            SELECT * FROM Notifications 
            WHERE UserID = @UserID
        `;

        if (unread === 'true') {
            query += ` AND Read = 0`;
        }

        query += ` ORDER BY CreatedAt DESC`;

        const notifications = await getAll(query, { UserID: userID });

        res.json({
            success: true,
            count: notifications.length,
            notifications,
            requestId: req.requestId
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        throw error;
    }
};

// ============================================
// 3. GET NOTIFICATION BY ID
// ============================================

const getNotificationById = async (req, res) => {
    try {
        const notification = await getOne(
            `SELECT * FROM Notifications WHERE NotificationID = @NotificationID`,
            { NotificationID: req.params.id }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
                requestId: req.requestId
            });
        }

        res.json({
            success: true,
            notification,
            requestId: req.requestId
        });
    } catch (error) {
        console.error('Get notification error:', error);
        throw error;
    }
};

// ============================================
// 4. MARK NOTIFICATION AS READ
// ============================================

const markAsRead = async (req, res) => {
    try {
        const notificationID = req.params.id;

        const result = await poolPromise.request()
            .input('NotificationID', sql.Int, notificationID)
            .query(`
                UPDATE Notifications 
                SET Read = 1 
                WHERE NotificationID = @NotificationID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
                requestId: req.requestId
            });
        }

        res.json({
            success: true,
            message: 'Notification marked as read',
            requestId: req.requestId
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        throw error;
    }
};

// ============================================
// 5. MARK ALL NOTIFICATIONS AS READ
// ============================================

const markAllAsRead = async (req, res) => {
    try {
        const userID = req.user.UserID;

        await poolPromise.request()
            .input('UserID', sql.Int, userID)
            .query(`
                UPDATE Notifications 
                SET Read = 1 
                WHERE UserID = @UserID AND Read = 0
            `);

        res.json({
            success: true,
            message: 'All notifications marked as read',
            requestId: req.requestId
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        throw error;
    }
};

// ============================================
// 6. DELETE NOTIFICATION
// ============================================

const deleteNotification = async (req, res) => {
    try {
        const notificationID = req.params.id;

        const result = await poolPromise.request()
            .input('NotificationID', sql.Int, notificationID)
            .query(`DELETE FROM Notifications WHERE NotificationID = @NotificationID`);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
                requestId: req.requestId
            });
        }

        res.json({
            success: true,
            message: 'Notification deleted successfully',
            requestId: req.requestId
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        throw error;
    }
};

// ============================================
// 7. GET UNREAD COUNT
// ============================================

const getUnreadCount = async (req, res) => {
    try {
        const userID = req.user.UserID;

        const result = await poolPromise.request()
            .input('UserID', sql.Int, userID)
            .query(`
                SELECT COUNT(*) AS UnreadCount 
                FROM Notifications 
                WHERE UserID = @UserID AND Read = 0
            `);

        res.json({
            success: true,
            unreadCount: result.recordset[0].UnreadCount,
            requestId: req.requestId
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        throw error;
    }
};

// ============================================
// 8. EXPORT
// ============================================

module.exports = {
    createNotification,
    getUserNotifications,
    getNotificationById,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
};
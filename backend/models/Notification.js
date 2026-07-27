const { sql, poolPromise, getOne, getAll, insert, update } = require('../config/db');

const Notification = {
    // Create notification
    create: async (data) => {
        const { UserID, Title, Message } = data;
        const result = await insert(
            `INSERT INTO Notifications (UserID, Title, Message, Read, CreatedAt)
             OUTPUT INSERTED.NotificationID
             VALUES (@UserID, @Title, @Message, 0, GETDATE())`,
            { UserID, Title, Message }
        );
        return result;
    },

    // Get user notifications
    getUserNotifications: async (userID, unreadOnly = false) => {
        let query = `
            SELECT * FROM Notifications 
            WHERE UserID = @UserID
        `;
        if (unreadOnly) {
            query += ` AND Read = 0`;
        }
        query += ` ORDER BY CreatedAt DESC`;
        return getAll(query, { UserID: userID });
    },

    // Get notification by ID
    getById: async (notificationID) => {
        return getOne(
            `SELECT * FROM Notifications WHERE NotificationID = @NotificationID`,
            { NotificationID: notificationID }
        );
    },

    // Mark as read
    markAsRead: async (notificationID) => {
        const result = await poolPromise.request()
            .input('NotificationID', sql.Int, notificationID)
            .query(`
                UPDATE Notifications 
                SET Read = 1 
                WHERE NotificationID = @NotificationID
            `);
        return result.rowsAffected[0] > 0;
    },

    // Mark all as read
    markAllAsRead: async (userID) => {
        const result = await poolPromise.request()
            .input('UserID', sql.Int, userID)
            .query(`
                UPDATE Notifications 
                SET Read = 1 
                WHERE UserID = @UserID AND Read = 0
            `);
        return result.rowsAffected[0];
    },

    // Get unread count
    getUnreadCount: async (userID) => {
        const result = await poolPromise.request()
            .input('UserID', sql.Int, userID)
            .query(`
                SELECT COUNT(*) AS UnreadCount 
                FROM Notifications 
                WHERE UserID = @UserID AND Read = 0
            `);
        return result.recordset[0].UnreadCount;
    },

    // Delete notification
    delete: async (notificationID) => {
        const result = await poolPromise.request()
            .input('NotificationID', sql.Int, notificationID)
            .query(`DELETE FROM Notifications WHERE NotificationID = @NotificationID`);
        return result.rowsAffected[0] > 0;
    },

    // Delete all user notifications
    deleteAll: async (userID) => {
        const result = await poolPromise.request()
            .input('UserID', sql.Int, userID)
            .query(`DELETE FROM Notifications WHERE UserID = @UserID`);
        return result.rowsAffected[0];
    }
};

module.exports = Notification;
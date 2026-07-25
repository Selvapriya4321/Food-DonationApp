const db = require("../config/db");

const Profile = {

    // Get user profile by ID
    getByUserId: async (userId) => {

        const query = `
            SELECT
                id,
                name,
                email,
                phone,
                role
            FROM Users
            WHERE id = @userId
        `;

        return db.query(query, { userId });
    },

    // Update user profile
    update: async (userId, profile) => {

        const query = `
            UPDATE Users
            SET
                name = @name,
                phone = @phone
            WHERE id = @userId
        `;

        return db.query(query, {
            userId,
            name: profile.name,
            phone: profile.phone
        });
    },

    // Change password
    changePassword: async (userId, hashedPassword) => {

        const query = `
            UPDATE Users
            SET password = @password
            WHERE id = @userId
        `;

        return db.query(query, {
            userId,
            password: hashedPassword
        });
    },

    // Delete account
    deleteAccount: async (userId) => {

        const query = `
            DELETE FROM Users
            WHERE id = @userId
        `;

        return db.query(query, { userId });
    }

};

module.exports = Profile;
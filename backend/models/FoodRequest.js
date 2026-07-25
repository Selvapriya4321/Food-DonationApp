const db = require("../config/db");

const FoodRequest = {

    // Create Request
    create: async (request) => {

        const query = `
        INSERT INTO FoodRequests
        (
            food_id,
            user_id,
            message,
            status
        )
        VALUES
        (
            @food_id,
            @user_id,
            @message,
            'Pending'
        )
        `;

        return db.query(query, request);
    },

    // Get All Requests
    getAll: async () => {

        const query = `
        SELECT
            FoodRequests.*,
            Users.name
        FROM FoodRequests
        JOIN Users
        ON FoodRequests.user_id = Users.id
        `;

        return db.query(query);
    },

    // Update Request Status
    updateStatus: async (id, status) => {

        const query = `
        UPDATE FoodRequests
        SET status = @status
        WHERE id = @id
        `;

        return db.query(query, {
            id,
            status
        });
    },

    // Delete Request
    delete: async (id) => {

        const query = `
        DELETE FROM FoodRequests
        WHERE id = @id
        `;

        return db.query(query, {
            id
        });
    }

};

module.exports = FoodRequest;
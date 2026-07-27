const { poolPromise } = require('../config/database');

const FoodDonation = {
    // Create donation
    create: async (donationData) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', donationData.UserID)
            .input('FoodName', donationData.FoodName)
            .input('Category', donationData.Category)
            .input('FoodType', donationData.FoodType)
            .input('Quantity', donationData.Quantity)
            .input('NumberOfPeople', donationData.NumberOfPeople)
            .input('PickupAddress', donationData.PickupAddress)
            .input('PickupTime', donationData.PickupTime)
            .input('Status', donationData.Status || 'Available')
            .query(`
                INSERT INTO FoodDonations 
                (UserID, FoodName, Category, FoodType, Quantity, NumberOfPeople, PickupAddress, PickupTime, Status)
                VALUES 
                (@UserID, @FoodName, @Category, @FoodType, @Quantity, @NumberOfPeople, @PickupAddress, @PickupTime, @Status);
                SELECT SCOPE_IDENTITY() AS DonationID;
            `);
        return result.recordset[0];
    },

    // Get all donations
    getAll: async (filters = {}) => {
        const pool = await poolPromise;
        let query = `
            SELECT 
                fd.DonationID,
                fd.FoodName,
                fd.Category,
                fd.FoodType,
                fd.Quantity,
                fd.NumberOfPeople,
                fd.PickupAddress,
                fd.PickupTime,
                fd.Status,
                u.UserID,
                u.FullName AS DonorName,
                u.Email AS DonorEmail,
                u.Phone AS DonorPhone
            FROM FoodDonations fd
            LEFT JOIN Users u ON fd.UserID = u.UserID
        `;
        
        const conditions = [];
        if (filters.Status) {
            conditions.push(`fd.Status = @Status`);
        }
        
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }
        
        query += ` ORDER BY fd.PickupTime DESC`;

        const request = pool.request();
        if (filters.Status) {
            request.input('Status', filters.Status);
        }
        
        const result = await request.query(query);
        return result.recordset;
    },

    // Get donation by ID
    findById: async (donationID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('DonationID', donationID)
            .query(`
                SELECT 
                    fd.*,
                    u.UserID,
                    u.FullName AS DonorName,
                    u.Email AS DonorEmail,
                    u.Phone AS DonorPhone
                FROM FoodDonations fd
                LEFT JOIN Users u ON fd.UserID = u.UserID
                WHERE fd.DonationID = @DonationID
            `);
        return result.recordset[0];
    },

    // Get user's donations
    findByUser: async (userID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', userID)
            .query(`
                SELECT * FROM FoodDonations 
                WHERE UserID = @UserID 
                ORDER BY PickupTime DESC
            `);
        return result.recordset;
    },

    // Update donation status
    updateStatus: async (donationID, status) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('DonationID', donationID)
            .input('Status', status)
            .query(`
                UPDATE FoodDonations 
                SET Status = @Status 
                WHERE DonationID = @DonationID;
                SELECT * FROM FoodDonations WHERE DonationID = @DonationID;
            `);
        return result.recordset[0];
    },

    // Update donation
    update: async (donationID, updateData) => {
        const pool = await poolPromise;
        const request = pool.request();
        request.input('DonationID', donationID);

        const fields = [];
        if (updateData.FoodName) {
            fields.push('FoodName = @FoodName');
            request.input('FoodName', updateData.FoodName);
        }
        if (updateData.Category) {
            fields.push('Category = @Category');
            request.input('Category', updateData.Category);
        }
        if (updateData.FoodType) {
            fields.push('FoodType = @FoodType');
            request.input('FoodType', updateData.FoodType);
        }
        if (updateData.Quantity) {
            fields.push('Quantity = @Quantity');
            request.input('Quantity', updateData.Quantity);
        }
        if (updateData.NumberOfPeople) {
            fields.push('NumberOfPeople = @NumberOfPeople');
            request.input('NumberOfPeople', updateData.NumberOfPeople);
        }
        if (updateData.PickupAddress) {
            fields.push('PickupAddress = @PickupAddress');
            request.input('PickupAddress', updateData.PickupAddress);
        }
        if (updateData.PickupTime) {
            fields.push('PickupTime = @PickupTime');
            request.input('PickupTime', updateData.PickupTime);
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        const query = `
            UPDATE FoodDonations 
            SET ${fields.join(', ')}
            WHERE DonationID = @DonationID;
            SELECT * FROM FoodDonations WHERE DonationID = @DonationID;
        `;

        const result = await request.query(query);
        return result.recordset[0];
    },

    // Delete donation
    delete: async (donationID) => {
        const pool = await poolPromise;
        await pool.request()
            .input('DonationID', donationID)
            .query('DELETE FROM FoodDonations WHERE DonationID = @DonationID');
    },

    // Get donation statistics
    getStats: async () => {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT 
                    COUNT(*) AS TotalDonations,
                    SUM(Quantity) AS TotalQuantity,
                    COUNT(DISTINCT UserID) AS TotalDonors,
                    COUNT(CASE WHEN Status = 'Available' THEN 1 END) AS AvailableDonations,
                    COUNT(CASE WHEN Status = 'Reserved' THEN 1 END) AS ReservedDonations,
                    COUNT(CASE WHEN Status = 'Completed' THEN 1 END) AS CompletedDonations
                FROM FoodDonations
            `);
        return result.recordset[0];
    }
};

module.exports = FoodDonation;
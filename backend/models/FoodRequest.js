const { poolPromise } = require('../config/database');

const FoodRequest = {
    // Create request
    create: async (requestData) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('DonationID', requestData.DonationID)
            .input('NGOID', requestData.NGOID)
            .input('Status', requestData.Status || 'Pending')
            .query(`
                INSERT INTO FoodRequests (DonationID, NGOID, Status)
                VALUES (@DonationID, @NGOID, @Status);
                SELECT SCOPE_IDENTITY() AS RequestID;
            `);
        return result.recordset[0];
    },

    // Get all requests
    getAll: async (filters = {}) => {
        const pool = await poolPromise;
        let query = `
            SELECT 
                fr.RequestID,
                fr.RequestDate,
                fr.Status,
                fd.DonationID,
                fd.FoodName,
                fd.Quantity,
                fd.PickupAddress,
                n.NGOID,
                n.NGOName,
                n.Email AS NGOEmail,
                n.Phone AS NGOPHone
            FROM FoodRequests fr
            LEFT JOIN FoodDonations fd ON fr.DonationID = fd.DonationID
            LEFT JOIN NGOs n ON fr.NGOID = n.NGOID
        `;
        
        const conditions = [];
        if (filters.Status) {
            conditions.push(`fr.Status = @Status`);
        }
        if (filters.NGOID) {
            conditions.push(`fr.NGOID = @NGOID`);
        }
        
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }
        
        query += ` ORDER BY fr.RequestDate DESC`;

        const request = pool.request();
        if (filters.Status) {
            request.input('Status', filters.Status);
        }
        if (filters.NGOID) {
            request.input('NGOID', filters.NGOID);
        }
        
        const result = await request.query(query);
        return result.recordset;
    },

    // Get request by ID
    findById: async (requestID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('RequestID', requestID)
            .query(`
                SELECT 
                    fr.*,
                    fd.FoodName,
                    fd.Quantity,
                    fd.PickupAddress,
                    n.NGOName,
                    n.Email AS NGOEmail,
                    n.Phone AS NGOPhone
                FROM FoodRequests fr
                LEFT JOIN FoodDonations fd ON fr.DonationID = fd.DonationID
                LEFT JOIN NGOs n ON fr.NGOID = n.NGOID
                WHERE fr.RequestID = @RequestID
            `);
        return result.recordset[0];
    },

    // Get requests by NGO
    findByNGO: async (ngoID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('NGOID', ngoID)
            .query(`
                SELECT 
                    fr.*,
                    fd.FoodName,
                    fd.Quantity,
                    fd.PickupAddress
                FROM FoodRequests fr
                LEFT JOIN FoodDonations fd ON fr.DonationID = fd.DonationID
                WHERE fr.NGOID = @NGOID
                ORDER BY fr.RequestDate DESC
            `);
        return result.recordset;
    },

    // Update request status
    updateStatus: async (requestID, status) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('RequestID', requestID)
            .input('Status', status)
            .query(`
                UPDATE FoodRequests 
                SET Status = @Status 
                WHERE RequestID = @RequestID;
                SELECT * FROM FoodRequests WHERE RequestID = @RequestID;
            `);
        return result.recordset[0];
    },

    // Delete request
    delete: async (requestID) => {
        const pool = await poolPromise;
        await pool.request()
            .input('RequestID', requestID)
            .query('DELETE FROM FoodRequests WHERE RequestID = @RequestID');
    }
};

module.exports = FoodRequest;
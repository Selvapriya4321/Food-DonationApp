const { poolPromise } = require('../config/database');

const NGO = {
    // Create NGO
    create: async (ngoData) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('NGOName', ngoData.NGOName)
            .input('Email', ngoData.Email)
            .input('Phone', ngoData.Phone)
            .input('Address', ngoData.Address)
            .query(`
                INSERT INTO NGOs (NGOName, Email, Phone, Address)
                VALUES (@NGOName, @Email, @Phone, @Address);
                SELECT SCOPE_IDENTITY() AS NGOID;
            `);
        return result.recordset[0];
    },

    // Get all NGOs
    getAll: async () => {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM NGOs ORDER BY NGOName');
        return result.recordset;
    },

    // Get NGO by ID
    findById: async (ngoID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('NGOID', ngoID)
            .query('SELECT * FROM NGOs WHERE NGOID = @NGOID');
        return result.recordset[0];
    },

    // Update NGO
    update: async (ngoID, updateData) => {
        const pool = await poolPromise;
        const request = pool.request();
        request.input('NGOID', ngoID);

        const fields = [];
        if (updateData.NGOName) {
            fields.push('NGOName = @NGOName');
            request.input('NGOName', updateData.NGOName);
        }
        if (updateData.Email) {
            fields.push('Email = @Email');
            request.input('Email', updateData.Email);
        }
        if (updateData.Phone) {
            fields.push('Phone = @Phone');
            request.input('Phone', updateData.Phone);
        }
        if (updateData.Address) {
            fields.push('Address = @Address');
            request.input('Address', updateData.Address);
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        const query = `
            UPDATE NGOs 
            SET ${fields.join(', ')}
            WHERE NGOID = @NGOID;
            SELECT * FROM NGOs WHERE NGOID = @NGOID;
        `;

        const result = await request.query(query);
        return result.recordset[0];
    },

    // Delete NGO
    delete: async (ngoID) => {
        const pool = await poolPromise;
        await pool.request()
            .input('NGOID', ngoID)
            .query('DELETE FROM NGOs WHERE NGOID = @NGOID');
    }
};

module.exports = NGO;
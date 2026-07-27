const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path - adjust to your actual path
const DB_PATH = path.join(__dirname, '../database');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        console.log(`📁 Database path: ${DB_PATH}`);
    }
});

// ===== PROMISIFIED FUNCTIONS =====

// For SELECT queries - returns all rows
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// For INSERT/UPDATE/DELETE - returns { lastID, changes }
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
}

// For SELECT - returns single row
function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// For pool promise (compatibility with existing code)
const poolPromise = {
    request: () => ({
        input: (name, value) => ({
            query: async (sql) => {
                // Convert @param to ? for SQLite
                const sqliteSql = sql.replace(/@(\w+)/g, '?');
                const params = [];
                // We need to extract params from the input calls
                // This is a simplified version
                return { recordset: await query(sqliteSql, [value]) };
            }
        })
    })
};

module.exports = {
    db,
    query,
    run,
    get,
    poolPromise
};
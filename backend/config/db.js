const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log("✅ Database Connected");
  } catch (err) {
    console.error("❌ Database Connection Error:", err);
    process.exit(1); // Stop server if DB connection fails
  }
}

module.exports = {
  sql,
  connectDB,
};
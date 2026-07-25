const express = require("express");
const cors = require("cors");
const { sql, poolPromise } = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.send("🍱 Food Donation API is Running...");
});

// Get Donations
app.get("/api/donations", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Donations");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add Donation
app.post("/api/donations", async (req, res) => {
    try {
        const { donorName, foodItem, quantity, location } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input("DonorName", sql.VarChar, donorName)
            .input("FoodItem", sql.VarChar, foodItem)
            .input("Quantity", sql.Int, quantity)
            .input("Location", sql.VarChar, location)
            .query(`
                INSERT INTO Donations
                (DonorName, FoodItem, Quantity, Location)
                VALUES
                (@DonorName, @FoodItem, @Quantity, @Location)
            `);

        res.send("Donation Added Successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});
const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const donationRoutes = require("./routes/donationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ================= AUTH ROUTES =================
app.use("/api/auth", authRoutes);

// ================= DASHBOARD =================
app.use("/api/dashboard", dashboardRoutes);

// ================= DONATION ROUTES =================
app.use("/api/donations", donationRoutes);

// ================= HOME =================
app.get("/", (req, res) => {
    res.send("🍱 Food Donation API is Running...");
});

// ================= USERS =================
app.get("/api/users", (req, res) => {

    db.all("SELECT * FROM Users", [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(rows);

    });

});

// ================= FOOD DONATIONS =================
app.get("/api/donations", (req, res) => {

    db.all("SELECT * FROM FoodDonations", [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(rows);

    });

});

// ================= ADD DONATION =================
app.post("/api/donations", (req, res) => {

    const {
        UserID,
        FoodName,
        Category,
        FoodType,
        Quantity,
        NumberOfPeople,
        PickupAddress,
        PickupTime
    } = req.body;

    const sql = `
        INSERT INTO FoodDonations
        (
            UserID,
            FoodName,
            Category,
            FoodType,
            Quantity,
            NumberOfPeople,
            PickupAddress,
            PickupTime
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            UserID,
            FoodName,
            Category,
            FoodType,
            Quantity,
            NumberOfPeople,
            PickupAddress,
            PickupTime
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Food Donation Added Successfully",
                DonationID: this.lastID
            });

        }
    );

});

// ================= NGOs =================
app.get("/api/ngos", (req, res) => {

    db.all("SELECT * FROM NGOs", [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(rows);

    });

});

// ================= FOOD REQUESTS =================
app.get("/api/requests", (req, res) => {

    db.all("SELECT * FROM FoodRequests", [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(rows);

    });

});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
const express = require("express");

const router = express.Router();

// Register
router.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        user: {
            name,
            email
        }
    });

});

// Login
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    res.json({
        success: true,
        message: "Login Successful",
        user: {
            email
        }
    });

});

module.exports = router;
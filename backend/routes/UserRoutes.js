const express = require("express");

const router = express.Router();

let users = [];

// Get Users
router.get("/", (req, res) => {

    res.json({
        success: true,
        users
    });

});

// Add User
router.post("/", (req, res) => {

    users.push(req.body);

    res.status(201).json({
        success: true,
        message: "User Added",
        data: req.body
    });

});

// Update User
router.put("/:id", (req, res) => {

    res.json({
        success: true,
        message: `User ${req.params.id} Updated`,
        updatedData: req.body
    });

});

// Delete User
router.delete("/:id", (req, res) => {

    res.json({
        success: true,
        message: `User ${req.params.id} Deleted`
    });

});

module.exports = router;
const express = require("express");

const router = express.Router();

let donations = [];

// Get All Donations
router.get("/", (req, res) => {

    res.json({
        success: true,
        donations
    });

});

// Add Donation
router.post("/", (req, res) => {

    donations.push(req.body);

    res.status(201).json({
        success: true,
        message: "Donation Added Successfully",
        data: req.body
    });

});

// Update Donation
router.put("/:id", (req, res) => {

    res.json({
        success: true,
        message: `Donation ${req.params.id} Updated`,
        updatedData: req.body
    });

});

// Delete Donation
router.delete("/:id", (req, res) => {

    res.json({
        success: true,
        message: `Donation ${req.params.id} Deleted`
    });

});

module.exports = router;
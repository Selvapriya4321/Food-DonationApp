const express = require("express");

const router = express.Router();

let requests = [];

// Get Requests
router.get("/", (req, res) => {

    res.json({
        success: true,
        requests
    });

});

// Create Request
router.post("/", (req, res) => {

    requests.push(req.body);

    res.status(201).json({
        success: true,
        message: "Food Request Added",
        data: req.body
    });

});

// Update Request
router.put("/:id", (req, res) => {

    res.json({
        success: true,
        message: `Request ${req.params.id} Updated`,
        updatedData: req.body
    });

});

// Delete Request
router.delete("/:id", (req, res) => {

    res.json({
        success: true,
        message: `Request ${req.params.id} Deleted`
    });

});

module.exports = router;
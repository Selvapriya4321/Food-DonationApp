const express = require("express");
const router = express.Router();

const { sql, poolPromise } = require("../config/db");


// SAVE FOOD DONATION
router.post("/donate", async (req, res) => {

    try {

        const {
            UserID,
            FoodName,
            Category,
            FoodType,
            Quantity,
            NumberOfPeople,
            PickupAddress,
            PickupTime,
            Status,
            Description
        } = req.body;


        const pool = await poolPromise;


        await pool.request()

        .input("UserID", sql.Int, UserID)
        .input("FoodName", sql.NVarChar, FoodName)
        .input("Category", sql.NVarChar, Category)
        .input("FoodType", sql.NVarChar, FoodType)
        .input("Quantity", sql.Int, Quantity)
        .input("NumberOfPeople", sql.Int, NumberOfPeople)
        .input("PickupAddress", sql.NVarChar, PickupAddress)
        .input("PickupTime", sql.DateTime, PickupTime)
        .input("Status", sql.NVarChar, Status)


        .query(`
        
        INSERT INTO FoodDonations
        (
        UserID,
        FoodName,
        Category,
        FoodType,
        Quantity,
        NumberOfPeople,
        PickupAddress,
        PickupTime,
        Status
        )

        VALUES
        (
        @UserID,
        @FoodName,
        @Category,
        @FoodType,
        @Quantity,
        @NumberOfPeople,
        @PickupAddress,
        @PickupTime,
        @Status
        )

        `);


        res.json({
            success:true,
            message:"Food Donation Added Successfully"
        });


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            success:false,
            message:"Donation Failed"
        });

    }

});


module.exports = router;
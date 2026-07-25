// Temporary storage (works without a database)
let donations = [];

// ==========================
// Create Donation
// ==========================
exports.createDonation = async (req, res) => {
    try {

        const {
            food_name,
            category,
            quantity,
            food_type,
            location,
            description
        } = req.body;

        const donation = {
            id: donations.length + 1,
            user_id: req.user ? req.user.id : 1,
            food_name,
            category,
            quantity,
            food_type,
            location,
            description,
            createdAt: new Date()
        };

        donations.push(donation);

        res.status(201).json({
            success: true,
            message: "Food donation created successfully",
            donation
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ==========================
// Get All Donations
// ==========================
exports.getAllDonations = async (req, res) => {

    res.status(200).json({
        success: true,
        donations
    });

};

// ==========================
// Get My Donations
// ==========================
exports.getMyDonations = async (req, res) => {

    const userId = req.user ? req.user.id : 1;

    const myDonations = donations.filter(
        donation => donation.user_id === userId
    );

    res.status(200).json({
        success: true,
        donations: myDonations
    });

};

// ==========================
// Update Donation
// ==========================
exports.updateDonation = async (req, res) => {

    const id = parseInt(req.params.id);

    const donation = donations.find(d => d.id === id);

    if (!donation) {
        return res.status(404).json({
            success: false,
            message: "Donation not found"
        });
    }

    Object.assign(donation, req.body);

    res.status(200).json({
        success: true,
        message: "Donation updated successfully",
        donation
    });

};

// ==========================
// Delete Donation
// ==========================
exports.deleteDonation = async (req, res) => {

    const id = parseInt(req.params.id);

    const index = donations.findIndex(d => d.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Donation not found"
        });
    }

    donations.splice(index, 1);

    res.status(200).json({
        success: true,
        message: "Donation deleted successfully"
    });

};
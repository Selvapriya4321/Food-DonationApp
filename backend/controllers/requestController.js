// Temporary storage (works without a database)
let requests = [];

// ==========================
// Create Food Request
// ==========================
exports.createRequest = async (req, res) => {

    try {

        const { food_id, message } = req.body;

        const request = {
            id: requests.length + 1,
            food_id,
            user_id: req.user ? req.user.id : 1,
            message,
            status: "Pending",
            createdAt: new Date()
        };

        requests.push(request);

        res.status(201).json({
            success: true,
            message: "Food request sent successfully",
            request
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Get All Requests
// ==========================
exports.getAllRequests = async (req, res) => {

    try {

        res.status(200).json({
            success: true,
            requests
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Approve Request
// ==========================
exports.approveRequest = async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        const request = requests.find(r => r.id === id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        request.status = "Approved";

        res.status(200).json({
            success: true,
            message: "Request approved successfully",
            request
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Reject Request
// ==========================
exports.rejectRequest = async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        const request = requests.find(r => r.id === id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        request.status = "Rejected";

        res.status(200).json({
            success: true,
            message: "Request rejected successfully",
            request
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Delete Request
// ==========================
exports.deleteRequest = async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        const index = requests.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        requests.splice(index, 1);

        res.status(200).json({
            success: true,
            message: "Request deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
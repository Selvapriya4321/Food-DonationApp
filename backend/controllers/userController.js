const bcrypt = require("bcrypt");

// Temporary users array (acts like a database)
let users = [];

// ==========================
// Get User Profile
// ==========================
exports.getProfile = async (req, res) => {

    try {

        const user = users.find(u => u.id === (req.user ? req.user.id : 1));

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Update Profile
// ==========================
exports.updateProfile = async (req, res) => {

    try {

        const user = users.find(u => u.id === (req.user ? req.user.id : 1));

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { name, phone } = req.body;

        user.name = name || user.name;
        user.phone = phone || user.phone;

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Change Password
// ==========================
exports.changePassword = async (req, res) => {

    try {

        const user = users.find(u => u.id === (req.user ? req.user.id : 1));

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { password } = req.body;

        user.password = await bcrypt.hash(password, 10);

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Delete Account
// ==========================
exports.deleteAccount = async (req, res) => {

    try {

        const index = users.findIndex(
            u => u.id === (req.user ? req.user.id : 1)
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        users.splice(index, 1);

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
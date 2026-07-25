const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Temporary users array (acts like a database)
const users = [];

// ==========================
// Register
// ==========================
exports.register = async (req, res) => {
    try {

        const { name, email, password, phone, role } = req.body;

        // Check email already exists
        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
            phone,
            role
        };

        users.push(newUser);

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
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
// Login
// ==========================
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find user
        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
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
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Token format: Bearer <token>
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "mySecretKey123"
        );

        // Store user details in request
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: error.message
        });

    }

};

module.exports = authMiddleware;
const jwt = require("jsonwebtoken");

const User = require("../models/user");


const protect = async (req, res, next) => {
    try {
        const authorization =
            req.headers.authorization;

        // Check if token exists
        if (
            !authorization ||
            !authorization.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message:"Authentication token is required"
            });
        }

        // Extract token
        const token =
            authorization.split(" ")[1];

        // Verify token
        const decoded =jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        // Find user from token
        const user = await User.findById(decoded.sub);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }

        // Attach user to request
        req.user = user;

        // Continue to controller
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message:"Invalid or expired authentication token"
        });
    }
};

module.exports = {
    protect
};
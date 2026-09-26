const rateLimit =require("express-rate-limit");
const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message:"Too many authentication requests. Please try again later."
        }
    });

module.exports = {
    authLimiter
};
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

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message:
            "Too many requests. Please try again later."
    }
});

module.exports = {
    authLimiter,
    apiLimiter
};
const { body } = require("express-validator");

// Register validation
const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({
            min: 2,
            max: 80
        })
        .withMessage(
            "Name must be between 2 and 80 characters"
        ),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .isLength({
            min: 8
        })
        .withMessage(
            "Password must contain at least 8 characters"
        )
];
// Login validation
const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

// Verify email validation
const verifyEmailValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("otp")
        .trim()
        .matches(/^\d{6}$/)
        .withMessage("OTP must be a 6-digit number")
];

// Resend verification validation
const resendVerificationValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail()
];


// Forgot password validation
const forgotPasswordValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail()
];

// Reset password validation
const resetPasswordValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("otp")
        .trim()
        .matches(/^\d{6}$/)
        .withMessage("OTP must be a 6-digit number"),

    body("newPassword")
        .isLength({
            min: 8
        })
        .withMessage(
            "New password must contain at least 8 characters"
        )
];

module.exports = {
    registerValidation,
    loginValidation,
    verifyEmailValidation,
    resendVerificationValidation,
    forgotPasswordValidation,
    resetPasswordValidation
};
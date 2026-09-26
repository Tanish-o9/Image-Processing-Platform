const express = require("express");

const {register,verifyEmail,resendVerification,login,forgotPassword,resetPassword,getMe} = require("../controllers/authcontroller");

const {protect} = require("../middleware/authmiddleware");

const {validate} = require("../middleware/validationmiddleware");

const {authLimiter} = require("../middleware/ratelimitermiddleware");

const {registerValidation,loginValidation,verifyEmailValidation,resendVerificationValidation,forgotPasswordValidation,resetPasswordValidation} = require("../validations/authvalidation");
const router = express.Router();

// Register
router.post("/register",authLimiter,registerValidation,validate,register);
// Verify email
router.post( "/verify-email", authLimiter, verifyEmailValidation, validate, verifyEmail);
// Resend verification OTP
router.post("/resend-verification",authLimiter,resendVerificationValidation,validate,resendVerification);
// Login
router.post("/login",authLimiter,loginValidation,validate,login);
// Forgot password
router.post("/forgot-password",authLimiter,forgotPasswordValidation,validate,forgotPassword);
// Reset password
router.post("/reset-password",authLimiter,resetPasswordValidation,validate,resetPassword);
// Get current logged-in user
router.get( "/me", protect,getMe);


module.exports = router;
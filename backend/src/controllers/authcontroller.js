const bcrypt = require("bcryptjs");
const User=require('../models/user')
const {generateOtp,hashOtp} = require("../utils/otp");
const {generateToken} = require("../utils/token");
const {successResponse} = require("../utils/response");
const {sendOtpEmail} = require("../services/mailservice");

const getOtpExpiry = () => {
  const minutes =
    Number(
      process.env.OTP_EXPIRES_MINUTES || 10
    );

  return new Date(
    Date.now() +
      minutes * 60 * 1000
  );
};

// register
const register = async (req,res,next) => {
  try {
    const {name,email,password} = req.body;
    if (!name ||!email ||!password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required"
      });

    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters"
      });

    }
    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser =
      await User.findOne({
        email: normalizedEmail
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists"
      });

    }
    const hashedPassword =await bcrypt.hash(password,12);
    const otp = generateOtp();

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        isEmailVerified: false,
        emailVerificationOtpHash:
          hashOtp(otp),
        emailVerificationExpiresAt:
          getOtpExpiry()

      });
    await sendOtpEmail({
      to: user.email,
      name: user.name,
      otp,
      purpose: "verify"
    });
    return successResponse(
      res,
      "Account created. Verification OTP sent to your email.",
      {
        userId: user._id,
        email: user.email
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

// verify email
const verifyEmail = async (req,res,next) => {
  try {
    const {email,otp} = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and OTP are required"
      });

    }
    const user = await User.findOne({
        email:email.toLowerCase().trim()
      }).select(
        "+emailVerificationOtpHash " +
        "+emailVerificationExpiresAt"
      );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }
    if (user.isEmailVerified) {
      return successResponse(
        res,
        "Email is already verified"
      );

    }
    if (
      !user.emailVerificationOtpHash ||
      !user.emailVerificationExpiresAt ||
      user.emailVerificationExpiresAt < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP."
      });

    }
    const hashedOtp = hashOtp(otp);
    if (
      hashedOtp !==
      user.emailVerificationOtpHash
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });

    }
    user.isEmailVerified = true;
    user.emailVerificationOtpHash =
      undefined;
    user.emailVerificationExpiresAt =
      undefined;

    await user.save();
    return successResponse(
      res,
      "Email verified successfully"
    );
  } catch (error) {
    next(error);
  }
};

//resend verification otp
const resendVerification = async (req,res,next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });

    }
    const user =
      await User.findOne({
        email:
          email.toLowerCase().trim()
      }).select(
        "+emailVerificationOtpHash " +
        "+emailVerificationExpiresAt"
      );
    if (!user) {
      return successResponse(
        res,
        "If the account exists, a verification OTP has been sent."
      );
    }
    if (user.isEmailVerified) {
      return successResponse(
        res,
        "Email is already verified"
      );

    }
    const otp =
      generateOtp();
    user.emailVerificationOtpHash =
      hashOtp(otp);
    user.emailVerificationExpiresAt =
      getOtpExpiry();
    await user.save();
    await sendOtpEmail({
      to: user.email,
      name: user.name,
      otp,
      purpose: "verify"
    });
    return successResponse(
      res,
      "Verification OTP sent"
    );
  } catch (error) {
    next(error);
  }
};

// login
const login = async (req,res,next
) => {
  try {
    const {email,password} = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });

    }
    const user =
      await User.findOne({
        email:email.toLowerCase().trim()
      }).select("+password");

    if (!user ||!(await bcrypt.compare(password,user.password))) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });

    }
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in"
      });
    }
    const token = generateToken(user);
    return successResponse(
      res,
      "Login successful",{
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified:
            user.isEmailVerified
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

// fogot password
const forgotPassword = async (req,res,next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    const user =
      await User.findOne({
        email:
          email.toLowerCase().trim()
      }).select(
        "+passwordResetOtpHash " +
        "+passwordResetExpiresAt"
      );
    // Do not reveal whether an account exists.
    if (!user) {
      return successResponse(
        res,
        "If an account exists for this email, a password reset OTP has been sent."
      );

    }
    const otp =generateOtp();
    user.passwordResetOtpHash =hashOtp(otp);

    user.passwordResetExpiresAt =getOtpExpiry();
    await user.save();
    await sendOtpEmail({
      to: user.email,
      name: user.name,
      otp,
      purpose: "reset"

    });
    return successResponse(
      res,
      "If an account exists for this email, a password reset OTP has been sent."
    );

  } catch (error) {

    next(error);

  }
};


// reset password

const resetPassword = async (req,res,next) => {
    try {
    const {email,otp,newPassword} = req.body;

    if (!email ||!otp ||!newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Email, OTP and newPassword are required"
      });

    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters"
      });

    }
    const user =await User.findOne({
        email:
          email.toLowerCase().trim()
      }).select(
        "+password " +
        "+passwordResetOtpHash " +
        "+passwordResetExpiresAt"
      );
    if (!user || !user.passwordResetOtpHash ||!user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired password reset OTP"
      });

    }
    if (
      hashOtp(otp) !== user.passwordResetOtpHash) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired password reset OTP"
      });

    }
    user.password =await bcrypt.hash(newPassword,12);
    user.passwordResetOtpHash =
      undefined;
    user.passwordResetExpiresAt =
      undefined;
    await user.save();
    return successResponse(
      res,
      "Password reset successfully"
    );

  } catch (error) {
    next(error);
  }
};

// get current user

const getMe = async (req,res) => {
    return successResponse(
    res,
    "Current user",
    {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isEmailVerified:
          req.user.isEmailVerified
      }
    }
  );

};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  forgotPassword,
  resetPassword,
  getMe
};
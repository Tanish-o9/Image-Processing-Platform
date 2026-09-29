const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    // Email verification OTP
    emailVerificationOtpHash: {
      type: String,
      select: false
    },
    emailVerificationExpiresAt: {
      type: Date,
      select: false
    },
    // Password reset OTP
    passwordResetOtpHash: {
      type: String,
      select: false
    },
    passwordResetExpiresAt: {
      type: Date,
      select: false
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
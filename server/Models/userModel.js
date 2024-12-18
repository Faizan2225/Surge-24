const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
      maxLength: [30, "Name cannot exceed 30 characters."],
      minLength: [4, "Name should have atleast 4 characters."],
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email."],
    },
    password: {
      type: String,
      required: [true, "Please enter the password."],
      minLength: [8, "Password should have atleast 8 characters."],
      select: false,
    },
    role: {
      type: String,
      enum: ["individual", "worker", "organization_admin", "system_admin"],
      required: true,
      defualt: "individual",
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    phone: { type: String, required: false },
    emailVerified: { type: Boolean, default: false },
    emailVerificationOtp: { type: String, select: false },
    otpExpires: { type: Date },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // resetPasswordToken: String,
    // resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// compare password
userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

//get JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// // get reset password token
// userSchema.methods.getResetPasswordToken = function () {
//   /// generating token
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   // hasing and adding to user schema
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//   return resetToken;
// };
module.exports = mongoose.model("User", userSchema);

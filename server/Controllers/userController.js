const express = require("express");
const errorHandler = require("../utils/ErrorHandler");
const User = require("../models/userModel");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/jwtToken");

// register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.avatar) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required file" });
  }

  const file = req.files.avatar;

  const base64String = `data:${file.mimetype};base64,${file.data.toString(
    "base64"
  )}`;

  const myCloud = await cloudinary.v2.uploader.upload(base64String, {
    folder: "Surge",
    width: 500,
    crop: "scale",
  });

  const { name, email, password, role, bio } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
    bio,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 200, res);
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorHandler("Please Enter Email and Password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new errorHandler("Invalid Email or Password.", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new errorHandler("Incorrect Password.", 401));
  }

  sendToken(user, 200, res);
});

//logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now() - 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully.",
  });
});

//get user data
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new errorHandler("User not found with this email.", 404));
  }

  // get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}password/reset/${resetToken}`;

  const message = `Your password reset token is : \n\n${resetPasswordUrl} \n\n If you have not requested this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Email Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Password Recovery Email sent to ${user.email}.`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new errorHandler(err.message, 500));
  }
});

// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // search this token hash in our users data collections
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new errorHandler("Reset Password Token is not Valid or Expired.", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new errorHandler("Passwords don't match.", 400));
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// profile update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio,
  };

  if (req.body && req.body.avatar) {
    const user = await User.findById(req.user._id);

    if (user.avatar && user.avatar.public_id) {
      const imgId = user.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imgId);
    }

    const file = req.body.avatar;
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "ArtGalleryAvatars",
      width: 500,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, user });
});

// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  console.log("password");

  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new errorHandler("Old Password is Incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new errorHandler("Password does not Match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  console.log("password updated");

  sendToken(user, 200, res);
});

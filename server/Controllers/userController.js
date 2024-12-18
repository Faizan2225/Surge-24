const express = require("express");
const errorHandler = require("../Utils/ErrorHandler");
const User = require("../Models/userModel");
const cloudinary = require("cloudinary");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const Task = require("../Models/taskSchema");

// Register
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, role, organizationId } =
      req.body;

    if (!name || !email || !password) {
      return next(
        new errorHandler("Name, Email, and Password are required.", 400)
      );
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new errorHandler("Email already in use.", 401));
    }

    let organization = null;
    if (role === "organization-worker" || role === "organization-admin") {
      if (!organizationId) {
        return next(new errorHandler("Organization ID is required..", 401));
      }

      organization = await Organization.findById(organizationId);
      if (!organization) {
        next(new errorHandler("Organization not found.", 401));
      }
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      role: role || "individual",
      organization: organization ? organization._id : null,
      emailVerificationOtp: otp,
      otpExpires,
    });

    console.log(user.email);

    // Send OTP to user's email
    await sendEmail({
      email: user.email,
      subject: "Verify Your Email",
      message: `Your verification code is: ${otp}`,
    });

    res.status(201).json({
      success: true,
      message: "User registered! Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify email using OTP
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email }).select(
      "+emailVerificationOtp +otpExpires"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.emailVerificationOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email }).select(
      "+emailVerificationOtp +otpExpires"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.emailVerificationOtp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: "Verify Your Email",
        message: `Your verification code is: ${otp}`,
      });

      sendToken(user, 200, res);
    } catch (error) {
      res.status(401).json({
        message: error,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error. Please try again." });
  }
};

// login
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

// ------------TASKS----------------

// assign task to uder
exports.assignTaskToWorker = catchAsyncErrors(async (req, res, next) => {
  const { taskId, workerId } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    return next(new errorHandler("Task not found.", 404));
  }

  const organization = await Organization.findById(req.user.organization);
  if (
    !organization ||
    organization.admin.toString() !== req.user._id.toString()
  ) {
    return next(new errorHandler("Only admin can assign tasks.", 403));
  }

  task.assignedTo = workerId;
  await task.save();

  res.status(200).json({
    success: true,
    message: "Task assigned successfully.",
    task,
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

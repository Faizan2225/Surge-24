const Organization = require("../Models/organizationsModel");
const User = require("../Models/userModel");
const errorHandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const crypto = require("crypto");
const sendEmail = require("../Utils/sendEmail");
const Need = require("../Models/needModel");
const geolib = require("geolib");

exports.createOrganization = catchAsyncErrors(async (req, res, next) => {
  const { name, email, contactNumber, address, latitude, longitude } = req.body;

  const admin = await User.findById(req.user._id);

  if (!admin.emailVerified) {
    return next(
      new errorHandler("User must be verified to perform this action.", 403)
    );
  }

  if (!admin || admin.role !== "organization_admin") {
    return next(new errorHandler("Only admins can create organizations.", 403));
  }

  // Check if the organization email already exists
  const existingOrganization = await Organization.findOne({ email });

  if (existingOrganization) {
    return next(
      new errorHandler("Organization with this email already exists.", 400)
    );
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000;

  const organization = await Organization.create({
    name,
    email,
    contactNumber,
    address,
    location: { latitude, longitude },
    emailVerificationOtp: otp,
    otpExpires,
    admin: req.user._id,
  });

  // Send OTP to user's email
  await sendEmail({
    email: organization.email,
    subject: "Verify Your Email",
    message: `Your verification code is: ${otp}`,
  });

  res.status(201).json({
    success: true,
    message: "User registered! Please verify your email.",
  });
});

// Verify email using OTP
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const organization = await Organization.findOne({ email }).select(
      "+emailVerificationOtp +otpExpires"
    );
    if (!organization) {
      return res.status(404).json({ message: "User not found." });
    }

    if (organization.emailVerificationOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (organization.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Mark email as verified
    organization.verified = true;
    organization.emailVerificationOtp = undefined;
    organization.otpExpires = undefined;
    await organization.save();

    res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add worker to organization
exports.addWorkerToOrganization = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.body;
  const organization = await Organization.findById(req.params.id);

  if (!organization) {
    return next(new errorHandler("Organization not found.", 404));
  }

  if (!organization.verified) {
    return next(
      new errorHandler("Organization must be verified to add workers.", 404)
    );
  }

  if (organization.admin.toString() !== req.user._id.toString()) {
    return next(new errorHandler("Only the admin can add workers.", 403));
  }

  const userToAdd = await User.findById(userId);
  if (!userToAdd) {
    return next(new errorHandler("User not found.", 404));
  }

  if (organization.workers.includes(req.body.userId)) {
    return next(
      new errorHandler("Worker already exists in this organization.", 401)
    );
  }

  const user = await User.findById(userId);

  organization.workers.push(userToAdd._id);
  user.organization = organization._id;
  await organization.save();
  await user.save();

  res.status(200).json({
    success: true,
    message: "User has been added as a worker.",
    organization,
  });
});

// remove worker
exports.removeWorkerFromOrganization = catchAsyncErrors(
  async (req, res, next) => {
    const { userId } = req.body;
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return next(new errorHandler("Organization not found.", 404));
    }

    if (!organization.verified) {
      return next(
        new errorHandler("Organization must be verified to add workers.", 404)
      );
    }

    if (organization.admin.toString() !== req.user._id.toString()) {
      return next(new errorHandler("Only the admin can remove workers.", 403));
    }

    // Remove the user from the workers array
    organization.workers = organization.workers.filter(
      (worker) => worker.toString() !== userId.toString()
    );

    const user = await User.findById(userId);
    user.organization = null;

    await organization.save();

    res.status(200).json({
      success: true,
      message: "User has been removed from the workers.",
      organization,
    });
  }
);

// update organization
exports.updateOrganization = catchAsyncErrors(async (req, res, next) => {
  const { name, email, contactNumber, address, latitude, longitude } = req.body;

  const organization = await Organization.findById(req.params.id);

  if (!organization) {
    return next(new errorHandler("Organization not found.", 404));
  }

  if (organization.admin.toString() !== req.user._id.toString()) {
    return next(
      new errorHandler("Only the admin can update the organization.", 403)
    );
  }

  organization.name = name || organization.name;
  organization.email = email || organization.email;
  organization.contactNumber = contactNumber || organization.contactNumber;
  organization.address = address || organization.address;
  organization.location = { latitude, longitude } || organization.location;

  await organization.save();

  res.status(200).json({
    success: true,
    message: "Organization updated successfully.",
    organization,
  });
});

// get needs within 10km radius
exports.getNeedsFromRadius = catchAsyncErrors(async (req, res, next) => {
  const organizationId = req.params.organizationId;

  const organization = await Organization.findById(organizationId);

  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
  }

  const { latitude, longitude } = organization.location;

  // Fetch all needs
  const needs = await Need.find({});

  const nearbyNeeds = needs.filter((need) => {
    const needLatitude = need.location.latitude;
    const needLongitude = need.location.longitude;

    // Calculate the distance between the organization's location and the need's location
    const distance = geolib.getDistance(
      { latitude, longitude },
      { latitude: needLatitude, longitude: needLongitude }
    );

    return distance <= 10000;
  });

  return res.status(200).json({ needs: nearbyNeeds });
});

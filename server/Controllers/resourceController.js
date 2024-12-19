const Need = require("../Models/needModel");
const geolib = require("geolib");
const express = require("express");
const errorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const Task = require("../Models/taskSchema");
const Organization = require("../Models/organizationsModel");
const Resource = require("../Models/resourceSchema");

const isAdmin = async (userId, organizationId) => {
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new Error("Organization not found");
  }
  if (!organization.admin.equals(userId)) {
    throw new Error(
      "You are not authorized to assign tasks for this organization"
    );
  }
};

const isWorkerOfOrganization = async (userId, organizationId) => {
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new Error("Organization not found");
  }
  if (!organization.workers.includes(userId)) {
    throw new Error("User is not a worker in this organization");
  }
};

exports.createResource = catchAsyncErrors(async (req, res, next) => {
  const { type, quantity, status, latitude, longitude } = req.body;
  const organizationId = req.user.organization;

  await isAdmin(req.user._id, organizationId);

  const resource = await Resource.create({
    type,
    quantity,
    status,
    location: { longitude, latitude },
    organization: organizationId,
  });

  res.status(201).json({
    success: true,
    message: "Resource created successfully",
    data: resource,
  });
});

//get all
exports.getAllResources = catchAsyncErrors(async (req, res, next) => {
  const organizationId = req.user.organization;

  const resources = await Resource.find({ organization: organizationId })
    .populate("organization", "name location")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: resources,
  });
});

//update resource statas
exports.updateResourceStatus = catchAsyncErrors(async (req, res, next) => {
  const { resourceId } = req.params;
  const { status } = req.body;

  const resource = await Resource.findById(resourceId);

  if (!resource) {
    return res
      .status(404)
      .json({ success: false, message: "Resource not found" });
  }

  // Update the status
  resource.status = status;
  await resource.save();

  res.status(200).json({
    success: true,
    message: "Resource status updated successfully",
    data: resource,
  });
});

//assign resource to need
exports.assignResourceToNeed = catchAsyncErrors(async (req, res, next) => {
  const { resourceId, needId } = req.params;

  const resource = await Resource.findById(resourceId);
  const need = await Need.findById(needId);

  if (!resource) {
    return res
      .status(404)
      .json({ success: false, message: "Resource not found" });
  }

  if (!need) {
    return res.status(404).json({ success: false, message: "Need not found" });
  }

  need.resources.push(resourceId);
  resource.status = "In Progress";

  await resource.save();
  await need.save();

  res.status(200).json({
    success: true,
    message: "Resource assigned to need successfully",
    data: {
      resource,
      need,
    },
  });
});

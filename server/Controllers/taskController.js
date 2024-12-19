const express = require("express");
const errorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const Task = require("../Models/taskSchema");
const Need = require("../Models/needModel");
const User = require("../Models/userModel");
const Organization = require("../Models/organizationsModel");

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

// Create a task for a need
const createTask = async (req, res) => {
  try {
    const { needId, assignedTo, deadline } = req.body;

    const user = await User.findById(req.user._id);

    const org = user.organization;

    if (!org) {
      return next(
        new errorHandler("You are not admin to any organization.", 401)
      );
    }

    await isAdmin(req.user._id, org);

    await isWorkerOfOrganization(assignedTo, org);

    // Find the need
    const need = await Need.findById(needId);
    if (!need) {
      return res.status(404).json({ message: "Need not found" });
    }

    // Create a new task
    const task = new Task({
      need: needId,
      assignedTo,
      organization: org,
      deadline,
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await isAdmin(req.user.id, task.organization);

    task.status = status;
    await task.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTasks = catchAsyncErrors(async (req, res, next) => {
  const adminOrganizationId = req.user.organization;

  if (!adminOrganizationId) {
    return res
      .status(403)
      .json({ message: "You are not authorized to view tasks." });
  }

  const tasks = await Task.find({ organization: adminOrganizationId })
    .populate("assignedTo", "name email")
    .populate("need", "type description location urgencyLevel")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: tasks,
  });
});

const getAssignedTasks = catchAsyncErrors(async (req, res, next) => {
  const workerId = req.user._id;

  const tasks = await Task.find({ assignedTo: workerId })
    .populate("organization", "name location")
    .populate("need", "type description location urgencyLevel")
    .sort({ createdAt: -1 });

  if (!tasks || tasks.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No tasks assigned to you.",
    });
  }

  res.status(200).json({
    success: true,
    data: tasks,
  });
});

module.exports = {
  createTask,
  updateTaskStatus,
  getAllTasks,
  getAssignedTasks,
};

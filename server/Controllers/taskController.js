const express = require("express");
const errorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const Task = require("../Models/taskSchema");
const Need = require("../Models/needModel");
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
    const { needId, assignedTo, deadline, organizationId } = req.body;

    await isAdmin(req.user.id, organizationId);

    await isWorkerOfOrganization(assignedTo, organizationId);

    // Find the need
    const need = await Need.findById(needId);
    if (!need) {
      return res.status(404).json({ message: "Need not found" });
    }

    // Create a new task
    const task = new Task({
      need: needId,
      assignedTo,
      organization: organizationId,
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

module.exports = { createTask, updateTaskStatus };

module.exports = { createTask, updateTaskStatus };

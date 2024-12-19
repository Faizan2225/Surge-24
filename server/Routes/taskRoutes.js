const express = require("express");
const {
  createTask,
  updateTaskStatus,
  getAllTasks,
  getAssignedTasks,
} = require("../Controllers/taskController");
const { isAuthenticatedUser } = require("../Middlewares/auth");
const router = express.Router();

router.route("/task/create").post(isAuthenticatedUser, createTask);
router.route("/task/update/:taskId").put(isAuthenticatedUser, updateTaskStatus);
router.route("/task/all").get(isAuthenticatedUser, getAllTasks);
router.route("/task/assigned").get(isAuthenticatedUser, getAssignedTasks);

module.exports = router;

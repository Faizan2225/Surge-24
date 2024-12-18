const express = require("express");
const {
  createTask,
  updateTaskStatus,
} = require("../Controllers/taskController");
const { isAuthenticatedUser } = require("../Middlewares/auth");
const router = express.Router();

router.post("/task/create", isAuthenticatedUser, createTask);
router.get("/task/update", isAuthenticatedUser, updateTaskStatus);

module.exports = router;

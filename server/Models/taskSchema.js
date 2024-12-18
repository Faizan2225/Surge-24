const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  individual: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // one who needs help
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", // Organization addressing the task
  },
  type: {
    type: String,
    enum: ["Food", "Shelter", "Medical Assistance", "Other"],
    required: true,
  },
  description: {
    type: String,
    required: [
      true,
      "Please write the complete description; about what type of need is required.",
    ],
  },
  urgency: {
    type: String,
    enum: ["High", "Medium", "Low"],
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);

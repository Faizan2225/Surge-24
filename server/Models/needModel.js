const mongoose = require("mongoose");

const needSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // the one who needs help
    required: true,
  },
  category: {
    type: String,
    required: [true, "Please specify a category for the need."],
    enum: ["food", "shelter", "medical", "clothing", "other"], // Example categories
  },
  description: {
    type: String,
    required: [true, "Please provide a description of the need."],
  },
  location: {
    latitude: {
      type: Number,
      required: [true, "Please provide the latitude of the location."],
    },
    longitude: {
      type: Number,
      required: [true, "Please provide the longitude of the location."],
    },
  },
  status: {
    type: String,
    enum: ["open", "assigned", "fulfilled", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Need", needSchema);

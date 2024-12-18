const mongoose = require("mongoose");
const validator = require("validator");

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter organization name."],
  },
  email: {
    type: String,
    required: [true, "Please enter email."],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email."],
  },
  contactNumber: {
    type: String,
    required: [true, "Please entehr the contact number."],
  },
  address: {
    type: String,
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
  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
    },
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Organization admin
    required: true,
  },
  workers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Relief workers
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model("Organization", organizationSchema);

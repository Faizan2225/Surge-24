const resourceSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  type: {
    type: String,
    enum: ["Food", "Medical Kits", "Shelter Supplies", "Other"],
    required: true,
  },
  quantity: {
    type: Number,
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
    enum: ["Available", "In Progress", "Depleted"],
    default: "Available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resource", resourceSchema);

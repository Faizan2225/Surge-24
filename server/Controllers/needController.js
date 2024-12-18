const Need = require("../Models/needModel");

// Create a new need
exports.createNeed = async (req, res, next) => {
  try {
    const { category, description, latitude, longitude } = req.body;

    const newNeed = await Need.create({
      user: req.user._id,
      category,
      description,
      location: { latitude, longitude },
    });

    res.status(201).json({
      success: true,
      data: newNeed,
    });
  } catch (err) {
    next(err);
  }
};

// Get all needs
exports.getAllNeeds = async (req, res, next) => {
  try {
    const needs = await Need.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: needs,
    });
  } catch (err) {
    next(err);
  }
};

// Get a specific need by its ID
exports.getNeedById = async (req, res, next) => {
  try {
    const need = await Need.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!need) {
      return res.status(404).json({
        success: false,
        message: "Need not found",
      });
    }

    res.status(200).json({
      success: true,
      data: need,
    });
  } catch (err) {
    next(err);
  }
};

// Update a need (e.g., change the status of the need)
exports.updateNeed = async (req, res, next) => {
  try {
    const { status } = req.body;

    const need = await Need.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!need) {
      return res.status(404).json({
        success: false,
        message: "Need not found",
      });
    }

    res.status(200).json({
      success: true,
      data: need,
    });
  } catch (err) {
    next(err);
  }
};

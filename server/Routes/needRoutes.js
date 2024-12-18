const express = require("express");
const {
  createNeed,
  getAllNeeds,
  getNeedById,
  updateNeed,
} = require("../Controllers/needController");
const { isAuthenticatedUser } = require("../Middlewares/auth");
const router = express.Router();

router.post("/needs/create", isAuthenticatedUser, createNeed);
router.get("/needs/all", isAuthenticatedUser, getAllNeeds);
router.get("/needs/:id", isAuthenticatedUser, getNeedById);
router.put("/needs/:id", isAuthenticatedUser, updateNeed);

module.exports = router;

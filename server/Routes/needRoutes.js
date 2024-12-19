const express = require("express");
const {
  createNeed,
  getAllNeeds,
  getNeedById,
  // updateNeed,
  getFilteredNeeds,
} = require("../Controllers/needController");
const { isAuthenticatedUser, authorizeRoles } = require("../Middlewares/auth");
const router = express.Router();

router.post("/needs/create", isAuthenticatedUser, createNeed);
router.get(
  "/needs/all",
  isAuthenticatedUser,
  authorizeRoles("system_admin"),
  getAllNeeds
);
///needs?latitude=31.5204&longitude=74.3587&radius=10&urgency=High
router.get(
  "/needs/",
  isAuthenticatedUser,
  authorizeRoles("system_admin"),
  getFilteredNeeds
);
router.get("/needs/:id", isAuthenticatedUser, getNeedById);
// router.put("/needs/:id", isAuthenticatedUser, updateNeed);

module.exports = router;

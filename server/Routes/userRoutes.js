const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  logout,
  getUserDetails,
  verifyEmail,
  resetPassword,
  forgotPassword,
  updateProfile,
  updatePassword,
} = require("../Controllers/userController");
const { isAuthenticatedUser } = require("../Middlewares/auth");

router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
// router.route("/password/reset").post(forgotPassword);
// router.route("/password/reset/:token").put(resetPassword);
router.route("/profile/update").put(isAuthenticatedUser, updateProfile);
// router.route("/password/update").put(isAuthenticatedUser, updatePassword);

module.exports = router;

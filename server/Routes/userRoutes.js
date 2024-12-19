const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  logout,
  getUserDetails,
  verifyEmail,
  updateProfile,
  deleteUser,
  getAllUsers,
  promotUserToAdmin,
  getIndividualNeeds,
  getNearbyOrganizations,
} = require("../Controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../Middlewares/auth");

router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/profile/update").put(isAuthenticatedUser, updateProfile);
router
  .route("/user/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("system_admin"), deleteUser);
router
  .route("/users/all")
  .get(isAuthenticatedUser, authorizeRoles("system_admin"), getAllUsers);
router
  .route("/user/promote/:id")
  .put(isAuthenticatedUser, authorizeRoles("system_admin"), promotUserToAdmin);
router.route("/user/needs").get(isAuthenticatedUser, getIndividualNeeds);
// router
//   .route("/user/nearbyorg")
//   .get(isAuthenticatedUser, getNearbyOrganizations);
// router.route("/password/reset").post(forgotPassword);
// router.route("/password/reset/:token").put(resetPassword);
// router.route("/password/update").put(isAuthenticatedUser, updatePassword);

module.exports = router;

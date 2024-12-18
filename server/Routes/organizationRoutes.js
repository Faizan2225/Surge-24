const express = require("express");
const router = express.Router();
const {
  createOrganization,
  verifyEmail,
  addWorkerToOrganization,
} = require("../Controllers/organizationController");
const { isAuthenticatedUser } = require("../Middlewares/auth");

router
  .route("/organization/register")
  .post(isAuthenticatedUser, createOrganization);
router.route("/organization/verify-email").post(verifyEmail);
router
  .route("/organization/add-worker/:id")
  .post(isAuthenticatedUser, addWorkerToOrganization);
// router.route("/organization/details").get(isAuthenticatedUser, getUserDetails);

module.exports = router;

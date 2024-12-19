const express = require("express");
const router = express.Router();
const {
  createResource,
  updateResourceStatus,
  getAllResources,
  assignResourceToNeed,
} = require("../Controllers/resourceController");
const { isAuthenticatedUser, authorizeRoles } = require("../Middlewares/auth");
const { getNearbyResources } = require("../Controllers/organizationController");

router
  .route("/resource/create")
  .post(
    isAuthenticatedUser,
    authorizeRoles("organization_admin"),
    createResource
  );
router
  .route("/resource/update/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("organization_admin", "worker"),
    updateResourceStatus
  );

router.route("/resource/all").get(isAuthenticatedUser, getAllResources);
router
  .route("/resource/nearby")
  .get(
    isAuthenticatedUser,
    authorizeRoles("organization_admin"),
    getNearbyResources
  );
router.put(
  "/:resourceId/assign/:needId",
  isAuthenticatedUser,
  authorizeRoles("organization_admin"),
  assignResourceToNeed
);

module.exports = router;

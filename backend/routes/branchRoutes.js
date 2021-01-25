const express = require("express");

const router = express.Router();
const branchController = require("../controllers/branchController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(branchController.getAllBranches)
  .post(
    authController.restrictTo("super-admin", "hr"),
    branchController.createBranch
  );

router
  .route("/:id")
  .get(branchController.getBranch)
  .patch(
    authController.restrictTo("super-admin", "hr"),
    branchController.updateBranch
  )
  .delete(
    authController.restrictTo("super-admin", "hr"),
    branchController.deleteBranch
  );

module.exports = router;

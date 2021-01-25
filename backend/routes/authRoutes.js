const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  authController.protect,
  authController.restrictTo("super-admin"),
  authController.register
);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.route("/").get(authController.getAllUsers);

router
  .route("/:id")
  .get(authController.getUser)
  .patch(authController.updateUser)
  .delete(authController.deleteUser);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);

module.exports = router;

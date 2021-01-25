const express = require("express");
const authController = require("../controllers/authController");
const investmentController = require("../controllers/investmentController");
const mouController = require("../controllers/mouController");

const router = express.Router({ mergeParams: true });
router.use(authController.protect);
router
  .route("/")
  .get(investmentController.getAllInvestments)
  .post(
    authController.restrictTo("super-admin", "accounts"),
    investmentController.uploadProofPhoto,
    investmentController.resizeProofPhoto,
    investmentController.createInvestment
  );

router
  .route("/:id")
  .get(investmentController.getInvestment)
  .patch(
    authController.restrictTo("super-admin"),
    investmentController.updateInvestment
  )
  .delete(
    authController.restrictTo("super-admin"),
    investmentController.deleteInvestment
  );

router.patch(
  "/confirm-payment/:id",
  authController.restrictTo("super-admin", "special-duties"),
  investmentController.confirmPayment
);
router.patch(
  "/invoice/:investmentId",
  authController.restrictTo("super-admin", "account"),
  investmentController.getInvoice
);
router.patch(
  "/mou/:investmentId",
  authController.restrictTo("super-admin", "legal"),
  mouController.createMou
);

module.exports = router;

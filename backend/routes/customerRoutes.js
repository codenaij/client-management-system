const express = require("express");
const customerController = require("../controllers/customerController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(customerController.getAllCustomers)
  .post(
    authController.restrictTo("super-admin", "accounts"),
    customerController.createCustomer
  );

router
  .route("/:id")
  .get(customerController.getCustomer)
  .patch(
    authController.restrictTo("super-admin"),
    customerController.updateCustomer
  )
  .delete(
    authController.restrictTo("super-admin"),
    customerController.deleteCustomer
  );

module.exports = router;

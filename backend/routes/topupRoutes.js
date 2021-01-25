const express = require('express');
const topupController = require('../controllers/topupController');
const authController = require('../controllers/authController');
const mouController = require('../controllers/mouController');

const router = express.Router();
router.use(authController.protect);

router
  .route('/')
  .get(topupController.getAllTopUps)
  .post(
    authController.restrictTo('super-admin', 'investment'),
    topupController.createTopUp
  );

router
  .route('/:id')
  .get(topupController.getTopUp)
  .patch(authController.restrictTo('super-admin'), topupController.updateTopUp)
  .delete(
    authController.restrictTo('super-admin'),
    topupController.deleteTopUp
  );

router.patch(
  '/mou/:investmentId',
  authController.restrictTo('super-admin', 'legal'),
  mouController.createTopMou
);
router.patch(
  '/invoice/:investmentId',
  authController.restrictTo('super-admin', 'account'),
  topupController.getInvoice
);

module.exports = router;

const express = require('express');
const authController = require(`../Controllers/auth_controller`);

const router = express.Router();

router.post('/login', authController.login);

router.post('/logout', authController.protect, authController.logout);

router.post('/logout-beacon', authController.logoutBeacon);

router.post('/create-user', authController.protect, authController.restrictTo('admin', 'teacher'), authController.createUser);

router.post('/forgot-password', authController.forgotPassword);

router.patch('/reset-password/:token', authController.resetPassword);

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

module.exports = router;
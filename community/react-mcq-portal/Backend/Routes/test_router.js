const express = require('express');
const testController = require(`../Controllers/test_controller`);
const authController = require(`../Controllers/auth_controller`);
const { validateBody } = require(`../utils/validate`);
const { createTestSchema, updateTestSchema } = require(`../validation/schemas`);

const testRouter = express.Router();

// Protect all test routes
testRouter.use(authController.protect);

testRouter
  .route('/')
  .get(testController.getTodayTests)
  .post(
    authController.restrictTo('admin', 'teacher'),
    validateBody(createTestSchema),
    testController.createTest
  );

testRouter
  .route('/all')
  .get(authController.restrictTo('admin', 'teacher'), testController.getAllTests);

testRouter
  .route('/:id/results')
  .get(authController.restrictTo('admin', 'teacher'), testController.getTestResults);

testRouter
  .route('/:id')
  .get(testController.getTest)
  .patch(
    authController.restrictTo('admin', 'teacher'),
    validateBody(updateTestSchema),
    testController.updateTest
  )
  .delete(authController.restrictTo('admin', 'teacher'), testController.deleteTest);

module.exports = testRouter;

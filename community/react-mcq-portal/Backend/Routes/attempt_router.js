const express = require('express');
const attemptController = require(`../Controllers/attempt_controller`);
const authController = require(`../Controllers/auth_controller`);
const { validateBody } = require(`../utils/validate`);
const { submitAttemptSchema } = require(`../validation/schemas`);

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('student')); // only students can attempt

// Start test
router.post('/:testId/start', attemptController.startAttempt);

// Submit test (with validation)
router.post('/:testId/submit', validateBody(submitAttemptSchema), attemptController.submitAttempt);

// Past attempts
router.get('/past', attemptController.getPastAttempts);

// Attempted a particular test
router.get('/check/:testId', attemptController.checkAttempt);

module.exports = router;

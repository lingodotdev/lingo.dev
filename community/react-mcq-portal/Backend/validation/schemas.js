const Joi = require('joi');

exports.createTestSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow('').optional(),
  startTime: Joi.string().required(), // we’ll parse as IST
  examDuration: Joi.number().integer().min(1).default(120),
  questions: Joi.array().items(
    Joi.object({
      questionText: Joi.string().required(),
      options: Joi.array().items(Joi.string().required()).min(2).required(),
      correctAnswer: Joi.number().integer().min(0).required()
    })
  ).min(1).required()
});

exports.updateTestSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().allow('').optional(),
  examDuration: Joi.number().integer().min(1).optional(),
  questions: Joi.array().items(
    Joi.object({
      questionText: Joi.string().required(),
      options: Joi.array().items(Joi.string().required()).min(2).required(),
      correctAnswer: Joi.number().integer().min(0).required()
    })
  ).min(1).optional()
});

exports.submitAttemptSchema = Joi.object({
  answers: Joi.array().items(
    Joi.object({
      questionId: Joi.number().integer().min(0).required(),
      selectedOption: Joi.number().integer().min(0).required()
    })
  ).optional()
});

const Joi = require('joi');
const AppError = require(`${__dirname}/appErrors`);

exports.validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

    if (error) {
      // Collect all error messages into one string
      const message = error.details.map((d) => d.message).join(', ');
      return next(new AppError(`Validation failed: ${message}`, 400));
    }

    req.body = value; // sanitized body
    next();
  };
};

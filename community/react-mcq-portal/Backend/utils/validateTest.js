const AppError = require('./appErrors');

exports.validateTestInput = (body) => {
  if (!body.title || typeof body.title !== 'string') {
    throw new AppError('Test must have a valid title', 400);
  }

  if (!Array.isArray(body.questions) || body.questions.length < 1) {
    throw new AppError('Test must contain at least one question', 400);
  }

  body.questions.forEach((q, idx) => {
    if (!q.questionText || typeof q.questionText !== 'string') {
      throw new AppError(`Question ${idx + 1} is missing text`, 400);
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new AppError(`Question ${idx + 1} must have at least 2 options`, 400);
    }
    if (
      typeof q.correctAnswer !== 'number' ||
      q.correctAnswer < 0 ||
      q.correctAnswer >= q.options.length
    ) {
      throw new AppError(
        `Question ${idx + 1} must have a valid correctAnswer index`,
        400
      );
    }
  });
};

const AppError = require(`../utils/appErrors`);

// Handles Mongoose CastError (e.g., invalid ObjectId)
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handles Mongoose Duplicate Key errors (e.g., unique email)
const handleDuplicateFieldsDB = err => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: "${value}". Please use another value.`;
  return new AppError(message, 400);
};

// Handles Mongoose Validation errors (e.g., missing required fields)
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handles invalid JWT
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);

// Handles expired JWT
const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    // Create a copy to avoid mutating the original error object
    let error = { ...err, name: err.name, message: err.message, code: err.code, keyValue: err.keyValue, errors: err.errors };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
};
import { errorResponse } from './response.js';
import AppError from './app_error.js';

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status;

  if (err.isOperational) {
    return errorResponse(res, err.statusCode, err.message);
  } else {
    console.error('ERROR:', err);
    return errorResponse(res, err.statusCode, 'something went wrong!');
  }
};

export default globalErrorHandler;

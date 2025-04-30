import { ErrorRequestHandler } from 'express';
import config from '../../config';
import { ZodError } from 'zod';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || 'Something went wrong';

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      status: 400,
      message: 'Validation Error',
      error: err.issues,
      ...(config.env === 'development' && { stack: err.stack }), // ✅ already handled here
    });
    return
    
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    error: err?.message || null,
    ...(config.env === 'development' && err.stack && { stack: err.stack }), // ✅ this line ensures stack shows
  });
  return 
};

export default globalErrorHandler;

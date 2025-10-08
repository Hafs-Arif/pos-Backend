
function errorHandler(err, req, res, next) {
  // Log the error with all relevant details
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    method: req.method,
    path: req.path,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Send appropriate error response
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : err.message;

  res.status(status).json({ 
    success: false,
    message: message,
    ...(process.env.NODE_ENV !== 'production' && { error: err.message, stack: err.stack })
  });
}

export default errorHandler;

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Validation errors
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.array(),
    });
  }

  // Database errors
  if (err.code === '23505') {
    return res.status(400).json({ error: 'Duplicate entry' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ error: 'Invalid reference' });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;

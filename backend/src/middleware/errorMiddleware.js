function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.code === 11000) {
    return res.status(409).json({ message: 'This value already exists' });
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }

  res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : 'Server error'
  });
}

module.exports = { notFound, errorHandler };

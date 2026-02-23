module.exports = (err, req, res, next) => {
  const isCorsError = typeof err.message === 'string'
    && err.message.toLowerCase().includes('cors');
  const statusCode = err.status || err.statusCode || (isCorsError ? 403 : 500);

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : err.message
  });
};

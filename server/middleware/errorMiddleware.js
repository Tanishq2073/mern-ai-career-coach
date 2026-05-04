const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Something went wrong",
    data: null,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
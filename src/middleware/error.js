// @modules
require('dotenv').config()

// @exports
exports.errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    message: err.message,
    stack: enums.ENV.PRODUCTION === process.env.NODE_ENV ? '' : err.stack,
  })
}
// @modules
require('dotenv').config()
const jwt = require('jsonwebtoken')

// @exports
exports.templateVariables = (req, res, next) => {
  const token = req.signedCookies._secure
  const user = typeof(token) === 'undefined'
    ? null : jwt.verify(token, process.env.JWT_SECRET)

  res.locals.user = user
  res.locals.applang = process.env.APP_LANG
  res.locals.appname = process.env.APP_NAME
  res.locals.authmode = process.env.AUTH_MODE
  res.locals.domain = process.env.PEERTUBE_DOMAIN

  return next()
}
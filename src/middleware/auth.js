const jwt = require('jsonwebtoken')

exports.cookieJwtAuth = (req, res, next) => {
  const token = req.cookies._secure

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (err) {
    res.clearCookie('_secure')
    return res.redirect('/signin')
  }
}
// @modules


// @exports
exports.sessionAuth = (req, res, next) => {
  try {
    const token = req.signedCookies._secure
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (err) {
    res.clearCookie('_secure')
    return res.redirect('/signin')
  }
}
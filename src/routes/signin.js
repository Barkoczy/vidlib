// @modules
const jwt = require('jsonwebtoken')
const peertubeAPI = require('../utils/peertube-api')

// @exports
module.exports = async (req, res) => {
  const { username, password } = req.body

  if (process.env.PEERTUBE_USERNAME !== username) {
    return res.status(403).json({
      error: "Invalid login"
    })
  }
  if (process.env.PEERTUBE_PASSWORD !== password) {
    return res.status(403).json({
      error: "Invalid login"
    })
  }

  const user = await peertubeAPI.account()
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

  res.cookie('_secure', token, {
    maxAge: process.env.COOKIE_MAXAGE,
    httpOnly: true,
    secure: true,
    signed: true,
  })

  return res.redirect('/')
}
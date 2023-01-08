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
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' })

  res.cookie('_secure', token, {
    maxAge: 1000000,
    httpOnly: true,
    secure: 'prod' === process.env.NODE_ENV,
    signed: 'prod' === process.env.NODE_ENV,
  })

  return res.redirect('/')
}
// @modules
require('dotenv').config()
const jwt = require('jsonwebtoken')
const peertubeAPI = require('../utils/peertube-api')

// @exports
module.exports = async (req, res) => {
  const { username, password } = req.body

  const data = await peertubeAPI.login(
    username, password
  )

  if (data.hasOwnProperty('error')) {
    const params = new URLSearchParams({error: data.error})
    return res.redirect('/signin?'+params.toString())
  }

  const token = jwt.sign(data.user, process.env.JWT_SECRET, { expiresIn: data.expiresIn })

  res.cookie('_secure', token, {
    maxAge: data.expiresIn,
    httpOnly: true,
    secure: true,
    signed: true,
  })

  return res.redirect('/')
}
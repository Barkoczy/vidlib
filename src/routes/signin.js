// @modules
require('dotenv').config()
const jwt = require('jsonwebtoken')
const peertubeAPI = require('../utils/peertube-api')

// @exports
module.exports = async (req, res) => {
  const { username, password } = req.body
  let user = null
  let expiresIn = 0

  if ('peertube' === process.env.AUTH_MODE) {
    const data = await peertubeAPI.login(
      username, password
    )
  
    if (data.hasOwnProperty('error')) {
      const params = new URLSearchParams({error: data.error})
      return res.redirect('/signin?'+params.toString())
    }
  
    user = data.user
    expiresIn = data.expiresIn
  }

  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: expiresIn })

  res.cookie('_secure', token, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
    signed: true,
  })

  return res.redirect('/')
}
// @modules
require('dotenv').config()
const enums = require('../../enums')
const jwt = require('jsonwebtoken')
const peertubeAPI = require('../../utils/peertube-api')

// @exports
module.exports = async (req, res) => {
  const { domain, username, password } = req.body

  // @valid
  if (!Object.values(enums.AUTH_MODE).includes(process.env.AUTH_MODE)) {
    throw new Error('Authorization mode not defined')
  }

  // @strict
  if (enums.AUTH_MODE.STRICT === process.env.AUTH_MODE) {
    if (0 === process.env.PEERTUBE_USERNAME.length) {
      throw new Error('PEERTUBE_USERNAME is not defined')
    }
    if (0 === process.env.PEERTUBE_PASSWORD.length) {
      throw new Error('PEERTUBE_PASSWORD is not defined')
    }
    if (username !== process.env.PEERTUBE_USERNAME) {
      const params = new URLSearchParams({error: 'Username not match'})
      return res.redirect('/signin?'+params.toString())
    }
    if (password !== process.env.PEERTUBE_PASSWORD) {
      const params = new URLSearchParams({error: 'Password not match'})
      return res.redirect('/signin?'+params.toString())
    }

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

  // @credentials
  if (enums.AUTH_MODE.CREDENTIALS === process.env.AUTH_MODE) {

  }

  // @peertube
  if (enums.AUTH_MODE.PEERTUBE === process.env.AUTH_MODE) {
    const data = await peertubeAPI.login(
      username, password
    )
  
    if (data.hasOwnProperty('error')) {
      const params = new URLSearchParams({error: data.error})
      return res.redirect('/signin?'+params.toString())
    }
  }

  // @mixed
  if (enums.AUTH_MODE.MIXED === process.env.AUTH_MODE) {

  }
}
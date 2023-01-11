// @modules
require('dotenv').config()
const enums = require('../enums')
const peertubeAPI = require('../utils/peertube-api')
const router = require('express').Router()

// @middlewares
const { sessionAuth } = require('../middleware/auth/sessionAuth')
const { cookieJwtAuth } = require('../middleware/auth/cookieJWTAuth')

// @routes
const indexRoute = require('./routes/index')
const searchRoute = require('./routes/search')
const accountRoute = require('./routes/account')
const filterRoute = require('./routes/filter')
const videoRoute = require('./routes/video')
const signinRoute = require('./routes/signin')

// @router
router.get('/', cookieJwtAuth, indexRoute)
router.get('/account', cookieJwtAuth, accountRoute)
router.get('/search', cookieJwtAuth, searchRoute)
router.post('/filter', cookieJwtAuth, filterRoute)
router.get('/video/:id', cookieJwtAuth, videoRoute)
router.post('/signin', signinRoute)
router.get('/signin', (req, res) => {
  if (
    enums.AUTH_MODE.STRICT === process.env.AUTH_MODE &&
    typeof req.signedCookies._secure !== 'undefined'
  ) {
    res.redirect('/')
  } else {
    const { error } = req.query
    res.render('signin', {error})
  }
})
router.get('/signout', async (_, res) => {
  await peertubeAPI.logout()
  res.clearCookie('_secure')

  return res.redirect('/signin')
})

// @exports
module.exports = router

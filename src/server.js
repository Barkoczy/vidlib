// @modules
require('dotenv').config()
const path = require('path')
const cookieParser = require('cookie-parser')
const peertubeAPI = require('./utils/peertube-api')
const express = require('express')
const app = express()

// @express
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use((req, res, next) => {
  res.locals.appname = process.env.APP_NAME
  res.locals.videoBasePath = 'https://'+process.env.PEERTUBE_DOMAIN
  return next();
})
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use('/static', express.static(path.join(__dirname, '../public')))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.set('trust proxy', 1)

// @middlewares
const { cookieJwtAuth } = require('./middleware/auth')

// @routes
const indexRoute = require('./routes/index')
const videoRoute = require('./routes/video')
const signinRoute = require('./routes/signin')

// @router
app.get('/', cookieJwtAuth, indexRoute)
app.get('/video/:id', cookieJwtAuth, videoRoute)
app.post('/signin', signinRoute)
app.get('/signin', (_, res) => {
  res.render('signin')
})
app.get('/signout', (_, res) => {
  res.clearCookie('_secure')
  return res.redirect('/signin')
})

// @run
app.listen(process.env.SERVER_PORT, async () => {
  await peertubeAPI.auth()
})
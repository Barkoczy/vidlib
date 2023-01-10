// @modules
require('dotenv').config()
const path = require('path')
const cookieParser = require('cookie-parser')
const peertubeAPI = require('./utils/peertube-api')
const express = require('express')
const app = express()

// @middlewares
const { templateVariables } = require('./middleware/template')
const { cookieJwtAuth } = require('./middleware/auth')

// @express
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use('/static', express.static(path.join(__dirname, '../public')))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(templateVariables)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.set('trust proxy', 1)

// @routes
const indexRoute = require('./routes/index')
const searchRoute = require('./routes/search')
const accountRoute = require('./routes/account')
const filterRoute = require('./routes/filter')
const videoRoute = require('./routes/video')
const signinRoute = require('./routes/signin')

// @router
app.get('/', cookieJwtAuth, indexRoute)
app.get('/account', cookieJwtAuth, accountRoute)
app.get('/search', cookieJwtAuth, searchRoute)
app.post('/filter', cookieJwtAuth, filterRoute)
app.get('/video/:id', cookieJwtAuth, videoRoute)
app.post('/signin', signinRoute)
app.get('/signin', (req, res) => {
  const { error } = req.query
  res.render('signin', {error})
})
app.get('/signout', async (_, res) => {
  await peertubeAPI.logout()
  res.clearCookie('_secure')

  return res.redirect('/signin')
})

// @run
app.listen(process.env.SERVER_PORT, async () => {
  await peertubeAPI.auth()
})
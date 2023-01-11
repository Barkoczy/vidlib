// @modules
require('dotenv').config()
const enums = require('./enums')
const path = require('path')
const cookieParser = require('cookie-parser')
const peertubeAPI = require('./utils/peertube-api')
const express = require('express')
const app = express()

// @router
const router = require('./router')

// @middlewares
const { templateVariables } = require('./middleware/template')

// @express
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(express.json())
app.use('/static', express.static(path.join(__dirname, '../public')))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(templateVariables)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.set('view options', { rmWhitespace: true })
app.set('trust proxy', 1)

// @router
app.use('/', router)

// @error-handling
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    message: err.message,
    stack: enums.ENV.PRODUCTION === process.env.NODE_ENV ? '' : err.stack,
  })
})

// @run
app.listen(process.env.SERVER_PORT, async () => {
  await peertubeAPI.auth()
})

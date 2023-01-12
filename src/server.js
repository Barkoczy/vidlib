// @modules
require('dotenv').config()
const path = require('path')
const cookieParser = require('cookie-parser')
const minifyHTML = require('express-minify-html-3')
const peertubeAPI = require('./utils/peertube-api')
const express = require('express')
const app = express()

// @router
const router = require('./router')

// @middlewares
const { templateVariables } = require('./middleware/template')
const { errorHandler } = require('./middleware/error')

// @express
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(minifyHTML({
  override:      true,
  exception_url: false,
  htmlMinifier: {
    removeComments:            true,
    collapseWhitespace:        true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes:     true,
    removeEmptyAttributes:     true,
    minifyJS:                  true
  }
}))
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
app.use(errorHandler)

// @run
app.listen(process.env.SERVER_PORT, async () => {
  await peertubeAPI.auth()
})

// @modules
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const axios = require('axios')

// @credentials
let credentials = {
  "token": "",
  "expires_in": 0
}

// @func
async function video(videoId) {
  try {
    const res = await axios.get(
      `https://${process.env.PEERTUBE_DOMAIN}/api/v1/videos/${videoId}`
    )
    const res2 = await axios.get(
      `https://${process.env.PEERTUBE_DOMAIN}/api/v1/videos/${videoId}/description`
    )
    return {content: res2.data.description, ...res.data}
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
  }
}
async function feeds() {
  try {
    const limit = parseInt(
      process.env.PEERTUBE_FEED_LIMIT
    )
    const count = 0 < limit && limit <= 100 ? limit : 15
    const params = {
      isLocal: true,
      isLive: false,
      nsfw: false,
      sort: '-createdAt',
      include: 1,
      privacyOneOf: 2,
      count,
    }
    const res = await axios.get(
      `https://${process.env.PEERTUBE_DOMAIN}/api/v1/accounts/${process.env.PEERTUBE_USERNAME}/videos`
    , {params})
  
    return res.data
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
  }
}
async function account() {
  try {
    const res = await axios.get(
      `https://${process.env.PEERTUBE_DOMAIN}/api/v1/accounts/${process.env.PEERTUBE_USERNAME}`
    )
    return res.data
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
  }
}
async function token(client_id, client_secret) {
  try {
    const params = new URLSearchParams({
      client_id,
      client_secret,
      grant_type: 'password',
      response_type: 'code',
      username: process.env.PEERTUBE_USERNAME,
      password: process.env.PEERTUBE_PASSWORD
    })
  
    const res = await axios.post(
      `https://${process.env.PEERTUBE_DOMAIN}/api/v1/users/token`
    , params)
  
    return res.data
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
  }
}
async function client() {
  try {
    const res = await axios.get(
      `https://${process.env.PEERTUBE_DOMAIN}/api/v1/oauth-clients/local`
    )
    return res.data
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
  }
}
async function auth() {
  try {
    credentials = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../credentials.json'), 'utf8')
    )
  } catch (err) {
    console.error(`Error reading credentials from disk: ${err}`)
  }

  if (0 !== credentials.expires_in && Date.now() <= credentials.expires_in) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${credentials.token}`
    return
  }

  const {
    client_id, client_secret
  } = await client()

  const {
    access_token, expires_in
  } = await token(client_id, client_secret)

  credentials = {
    token: access_token,
    expires_in: Date.now() + (expires_in * 1000)
  }

  try {
    fs.writeFileSync(path.resolve(__dirname, '../../credentials.json'), JSON.stringify(credentials))
  } catch (err) {
    console.error(`Error writting credentials on disk: ${err}`)
  }
}

// @exports
module.exports = {
  video,
  feeds,
  account,
  auth
}
// @modules
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const axios = require('axios')

// @credentials
let credentials = {
  "access_token": "",
  "refresh_token": "",
  "token_type": "",
  "expires_in": 0,
  "refresh_token_expires_in": 0
}

async function video(videoId) {
  const res = await axios.get(
    `https://${process.env.PEERTUBE_DOMAIN}/api/v1/videos/${videoId}`
  )
  const res2 = await axios.get(
    `https://${process.env.PEERTUBE_DOMAIN}/api/v1/videos/${videoId}/description`
  )

  return {content: res2.data.description, ...res.data}
}
async function feeds() {
  const params = {
    isLocal: true,
    isLive: false,
    nsfw: false,
    sort: '-createdAt',
    include: 1,
    privacyOneOf: 2,
  }
  const res = await axios.get(
    `https://${process.env.PEERTUBE_DOMAIN}/api/v1/accounts/${process.env.PEERTUBE_USERNAME}/videos`
  , {params})

  return res.data
}
async function account() {
  const res = await axios.get(
    `https://${process.env.PEERTUBE_DOMAIN}/api/v1/accounts/${process.env.PEERTUBE_USERNAME}`
  )
  return res.data
}
async function token(client_id, client_secret) {
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
}
async function client() {
  const res = await axios.get(
    `https://${process.env.PEERTUBE_DOMAIN}/api/v1/oauth-clients/local`
  )
  return res.data
}
async function auth() {
  try {
    credentials = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../credentials.json'), 'utf8')
    )
  } catch (err) {
    console.log(`Error reading credentials from disk: ${err}`)
  }

  if (0 !== credentials.expires_in && Date.now() >= credentials.expires_in * 1000) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${credentials.access_token}`
    return
  }

  const {
    client_id, client_secret
  } = await client()

  const {
    access_token,
    refresh_token,
    token_type,
    expires_in,
    refresh_token_expires_in
  } = await token(client_id, client_secret)

  credentials = {
    access_token,
    refresh_token,
    token_type,
    expires_in,
    refresh_token_expires_in
  }

  try {
    fs.writeFileSync(path.resolve(__dirname, '../../credentials.json'), JSON.stringify(credentials))
  } catch (err) {
    console.log(`Error writting credentials on disk: ${err}`)
  }
}

module.exports = {
  video,
  feeds,
  account,
  auth
}
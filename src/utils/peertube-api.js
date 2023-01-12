// @modules
require('dotenv').config()
const fs = require('fs').promises
const path = require('path')
const axios = require('axios')

// @credentials
const default_credentials = {
  access_token: "", 
  refresh_token: "", 
  expires_in: 0,
  refresh_token_expires_in: 0
}

// @path
const filepath = path.resolve(process.cwd(), 'credentials.json')

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
async function feeds(
  username, include, privacyOneOf, count, sort
) {
  try {
    const params = {
      isLocal: true,
      isLive: false,
      nsfw: false,
      sort,
      include,
      privacyOneOf,
      count
    }
    const res = await axios.get(
      `https://${process.env.PEERTUBE_DOMAIN}/api/v1/accounts/${username}/videos`
    , {params})

    return {
      total: res.data.total,
      videos: res.data.data
    }
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
    return {
      total: 0, videos: []
    }
  }
}
async function account(username) {
  try {
    const res = await axios.get(
      `https://${process.env.PEERTUBE_DOMAIN}/api/v1/accounts/${username}`
    )
    return res.data
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
    return null
  }
}
async function user(userId) {
  try {
    const res = await axios.get(
      `https://${process.env.PEERTUBE_DOMAIN}/api/v1/users/${userId}`
    )
    return res.data
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
    return null
  }
}
async function login(username, password) {
  try {
    const {
      client_id, client_secret
    } = await client()
  
    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_token_expires_in
    } = await tokenWithPassword(
      client_id, 
      client_secret,
      username,
      password
    )
  
    // to miliseconds
    const expiresIn = expires_in * 1000
    const refreshTokenExpiresIn = refresh_token_expires_in * 1000

    // write credentials
    await writeCredentialsFile({
      access_token,
      refresh_token,
      expires_in: Date.now() + expiresIn,
      refresh_token_expires_in: Date.now() + refreshTokenExpiresIn
    })

    // axios authorization
    setAxiosAuthorization(access_token)

    // user
    const account_data = await account(username)

    // response
    return {
      user: account_data,
      expiresIn
    }
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
    return { error: 'Invalid login' }
  }
}
async function logout() {
  try {
    await writeCredentialsFile(default_credentials)
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
  }
}
async function refresh(token) {
  try {
    const {
      client_id, client_secret
    } = await client()
  
    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_token_expires_in
    } = await tokenWithRefreshToken(
      client_id, client_secret, token
    )
  
    // to miliseconds
    const expiresIn = expires_in * 1000
    const refreshTokenExpiresIn = refresh_token_expires_in * 1000
  
    // write credentials
    await writeCredentialsFile({
      access_token,
      refresh_token,
      expires_in: Date.now() + expiresIn,
      refresh_token_expires_in: Date.now() + refreshTokenExpiresIn
    })

    // axios authorization
    setAxiosAuthorization(access_token)
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
async function tokenWithPassword(
  client_id, client_secret, username, password
) {
  try {
    const params = new URLSearchParams({
      client_id,
      client_secret,
      grant_type: 'password',
      response_type: 'code',
      username,
      password
    })

    const res = await axios.post(
      `https://${process.env.PEERTUBE_DOMAIN}/api/v1/users/token`
    , params)
  
    return res.data
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
  }
}
async function tokenWithRefreshToken(
  client_id, client_secret, refresh_token
) {
  try {
    const params = new URLSearchParams({
      client_id,
      client_secret,
      grant_type: 'refresh_token',
      refresh_token
    })

    const res = await axios.post(
      `https://${process.env.PEERTUBE_DOMAIN}/api/v1/users/token`
    , params)
  
    return res.data
  } catch (err) {
    console.error(`Peertube API Error response: ${err}`)
  }
}
async function auth() {
  try {
    // create if not exits
    const exists = await existsCredentialsFile()

    if (!exists) {
      await writeCredentialsFile(default_credentials)
    }

    // credentials
    const credentials = await readCredentialsFile()

    // verify
    if (0 === credentials.expires_in) return
    if (Date.now() <= credentials.expires_in) {
      setAxiosAuthorization(credentials.access_token)
    } else {
      if (Date.now() <= credentials.refresh_token_expires_in) {
        await refresh(credentials.refresh_token)
      } else  {
        await writeCredentialsFile()
      }
    }
    return
  } catch (err) {
    console.error(`Error reading credentials from disk: ${err}`)
  }
}
async function existsCredentialsFile() {  
  try {
    await fs.access(filepath)
    return true
  } catch {
    return false
  }
}
async function writeCredentialsFile(credentials) {
  await fs.writeFile(filepath, JSON.stringify(credentials))
}
async function readCredentialsFile() {
  try {
    const data = await fs.readFile(filepath)
    return JSON.parse(data)
  } catch(err) {
    console.error('Cannot read credentials file')
    return null
  }
}
function setAxiosAuthorization(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// @exports
module.exports = {
  video,
  feeds,
  account,
  login,
  logout,
  auth
}
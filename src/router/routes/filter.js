// @modules
const peertubeAPI = require('../../utils/peertube-api')

// @exports
module.exports = async (req, res) => {
  const {
    include, privacyOneOf, count, sort
  } = req.body
  const user = req.user
  const data = await peertubeAPI.feeds(
    user.name, include, privacyOneOf, count, sort
  )
  res.render('components/video/list', data)
}
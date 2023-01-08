// @modules
const peertubeAPI = require('../utils/peertube-api')

// @exports
module.exports = async (req, res) => {
  const data = await peertubeAPI.feeds()

  res.render('index', {total: data.total, videos: data.data})
}
// @modules
const peertubeAPI = require('../../utils/peertube-api')

// @exports
module.exports = async (req, res) => {
  const videoId = req.params.id
  const data = await peertubeAPI.video(videoId)

  res.render('video', {video: data})
}
// @modules
const peertubeAPI = require('../utils/peertube-api')

// @exports
module.exports = async (req, res) => {
  const query = req.query.q
  const videos = []
  
  res.render('search', {query, videos})
}
// @modules
const peertubeAPI = require('../../utils/peertube-api')

// @exports
module.exports = async (req, res) => {
  const user = req.user
  res.render('account', {user})
}
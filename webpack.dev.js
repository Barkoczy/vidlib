const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'public/'),
    library: {
      name: 'app',
      type: 'var',
      export: 'default',
    },
  },
});

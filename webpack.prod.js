const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'public/'),
    library: {
      name: 'app',
      type: 'var',
      export: 'default',
    },
  },
});

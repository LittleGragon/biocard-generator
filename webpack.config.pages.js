const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.config.base');
const pagesBuildConfig = merge(config, {
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, ''),
  },
})
module.exports = pagesBuildConfig;

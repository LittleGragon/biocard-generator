const merge = require('webpack-merge');
const config = require('./webpack.config.base');
const prodConfig = merge(config, {
  mode: 'production',
});
module.exports = prodConfig;
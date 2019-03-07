const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./webpack.config.base');
const developConfig = merge(config, {
  mode: 'development',
  watch: true,
  devServer: {
    hot: true,
    contentBase: './client',
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
});
module.exports = developConfig;
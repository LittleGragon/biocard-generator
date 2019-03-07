const config = require('./webpack.config.base');
const webpack = require('webpack');
const developConfig = Object.assign({}, config, {
  devServer: {
    hot: true,
    contentBase: './client',
  },
  devtool: 'inline-source-map',
  plugins: [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
});
module.exports = developConfig;
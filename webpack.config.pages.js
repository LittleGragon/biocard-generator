const config = require('./webpack.config.base');
const path = require('path');
config.output = {
  filename: 'bundle.js',
  path: path.resolve(__dirname, 'public/pages'),
}
module.exports = config;
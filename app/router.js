
const glob = require('glob');
const path = require('path');

module.exports = (app) => {
  glob.sync(path.resolve(__dirname, './router/*.js')).forEach((file) => {
    require(path.resolve(file))(app); // eslint-disable-line
  });
  glob.sync(path.resolve(__dirname, './router/**/*.js')).forEach((file) => {
    require(path.resolve(file))(app); // eslint-disable-line
  });
};

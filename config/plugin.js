console.log('plugin is using');
debugger;
console.log('finish');
// had enabled by egg
// exports.static = true;

exports.nunjucks = {
  enabled: true,
  package: 'egg-view-nunjucks',
};

exports.pug = {
  enabled: true,
  package: 'egg-view-pug',
};
exports.proxyworker = {
  enable: true,
  package: 'egg-development-proxyworker',
};

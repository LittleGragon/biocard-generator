

module.exports = (appInfo) => {
  const config = {};

  // should change to your own
  config.keys = `${appInfo.name}_1498528613079_9792`;

  // add your config here
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
      '.ejs': 'nunjucks',
      '.pug': 'pug',
    },
  };
  config.proxyworker = {
    port: 10086,
  };
  config.security = {
    xframe: {
      enable: false,
    },
  };
  return config;
};

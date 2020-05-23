
module.exports = app => {
  const singlePagePaths = [
    '/',
    '/biocard',
    '/d3'
  ];
  singlePagePaths.map(path => {
    app.get(path, app.controller.index.index);
  })
};

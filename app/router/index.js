
module.exports = app => {
  const singlePagePaths = [
    '/',
    '/biocard',
  ];
  singlePagePaths.map(path => {
    app.get(path, app.controller.index.index);
  })
};

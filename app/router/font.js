module.exports = app => {
  app.get('/fonts', app.controller.font.list)
}


module.exports = (app) => {
  class HomeController extends app.Controller {
    * index() {
      const title = 'admin';
      yield this.ctx.render('index.pug', { title });
    }
  }
  return HomeController;
};

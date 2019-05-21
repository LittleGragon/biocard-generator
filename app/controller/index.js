

module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      const title = 'biocard';
      yield this.ctx.render('index.pug', { title });
    }
  }
  return HomeController;
};

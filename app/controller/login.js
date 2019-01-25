

module.exports = (app) => {
  class LoginController extends app.Controller {
    * index() {
      const title = 'Login';
      yield this.ctx.render('login/login.pug', { title });
    }
  }
  return LoginController;
};

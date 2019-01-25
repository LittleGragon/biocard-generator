

module.exports = (app) => {
  class User extends app.Service {
    constructor() {

    }
    * find(uid) {
      const user = yield this.ctx.db.query('');
      return user;
    }
    * delete(uid) {

    }
  }
  return User;
};

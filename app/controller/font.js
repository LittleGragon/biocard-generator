const fs = require('fs');
const path = require('path')
module.exports = app => {
  class FontController extends app.Controller {
    async list() {
      const result = await fs.readFileSync(path.resolve(__dirname, '../file/json.json'), error => {
        this.ctx.throw(error);
      });
      const json = JSON.parse(result);
      this.ctx.body = {
        data: json,
      };
    }
  }
  return FontController
}
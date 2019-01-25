

const test = require('unit.js');
const index = require('../index.js');

describe('Tests index', () => {
  it('verifies successful response', (done) => {
    index.get({ /* event */ }, { /* context */ }, (err, result) => {
      try {
        test.number(result.statusCode).is(200);
        test.string(result.body).contains('Congratulations');
        test.value(result).hasHeader('content-type', 'text/html');
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

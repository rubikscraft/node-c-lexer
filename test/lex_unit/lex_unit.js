const fs = require('fs');
const { assert } = require('chai');

const cases = {
  case_1: 9,
  case_2: 15,
  case_3: 63,
  case_4: 63,
};

describe('Tests for lexing unit', () => {
  it('Should be able to require tokenize as function', function () {
    const { tokenize } = require('../../lib/lex-unit.js');

    assert(tokenize);
    assert(typeof tokenize, 'function');
  });

  Object.keys(cases).forEach((currentCase) => {
    const tokenAmount = cases[currentCase];

    it(currentCase + ' should have ' + tokenAmount + ' tokens', async () => {
      const { tokenize } = require('../../lib/lex-unit.js');

      const input_file = __dirname + '/cases/' + currentCase + '.c.pp';

      const input_file_contents = fs.readFileSync(input_file, 'utf8');

      const tokens = tokenize(input_file_contents);

      assert.equal(tokens.length, tokenAmount);
    });
  });
});

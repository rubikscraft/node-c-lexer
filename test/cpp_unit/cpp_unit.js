const fs = require('fs');
const diff = require('diff');
const { assert } = require('chai');

const cases = ['case_1', 'case_2', 'case_3', 'case_4'];
describe('Tests for preprocessor removal unit', () => {
  it('Should be able to require clearPreprocessors as function', () => {
    const clearPreprocessors = require('../../lib/cpp-unit.js')
      .clearPreprocessors;

    assert(clearPreprocessors);
    assert(typeof clearPreprocessors, 'function');
  });

  cases.forEach(function (currentCase) {
    it(
      'Should successfully remove preprocessor from ' + currentCase + '.c file',
      async () => {
        const clearPreprocessors = require('../../lib/cpp-unit.js')
          .clearPreprocessors;

        const input_file = __dirname + '/cases/' + currentCase + '.c';
        const output_file = __dirname + '/cases/' + currentCase + '.c.pp';

        const output_file_contents = fs.readFileSync(output_file, 'utf8');
        const generated_file_contents = await clearPreprocessors(input_file);

        const diffed = diff.diffChars(
          output_file_contents,
          generated_file_contents,
        );
        assert.equal(diffed.length, 1);
      },
    );
  });
});

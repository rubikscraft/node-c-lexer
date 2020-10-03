const { execSync } = require('child_process');
const uuid = require('uuid');
const fs = require('fs');
const ReadLine = require('readline');

/**
 * Extracts preprocessor directives from a file
 * with the 'cpp' command that's in your PATH.
 * @param {string} fileName - Absolute path to the input file.
 * @param {string} outFile - An optional paramater that is assummed
 *  To be the corresponding preprocessed file, when provided
 *  Automatic preprocessing with 'cpp' is omitted.
 */
async function clearPreprocessors(fileName, outFile) {
  const tempCppFileName = uuid.v1();

  if (outFile) return clear_pp_portion(fileName, outFile, false);

  // Can throw error
  execSync('cpp' + ' ' + fileName + ' ' + tempCppFileName);

  return clear_pp_portion(fileName, tempCppFileName, true);
}

/**
 * Extracts preprocessor directives from an already
 * preprocessed file
 * @param {string} original - Absolute path to the unpreprocessed file.
 * @param {string} preprocessed - Absolute path the the coresseponding preprocessed file.
 * @param {bool} delPreprocessed - delete (preprocessed) if true
 */
async function clear_pp_portion(original, preprocessed, delPreprocessed) {
  return new Promise((resolve, reject) => {
    const line_reader = ReadLine.createInterface({
      input: fs.createReadStream(preprocessed),
    });

    const file_name_to_match = '"' + original + '"';

    let on_off_flag = false;
    let list_of_lines = [];
    let target_line_no = 0;

    line_reader.on('line', (line) => {
      const tokens = line.split(' ');

      if (tokens[0] === '#') {
        const line_no = parseInt(tokens[1]);
        const file_name = tokens[2];

        if (file_name === file_name_to_match) {
          on_off_flag = true;
          target_line_no = line_no;
        } else {
          if (on_off_flag === true) list_of_lines.push('');
          on_off_flag = false;
        }
      } else if (on_off_flag === true) {
        if (target_line_no <= list_of_lines.length) {
          line = line.trim();
          list_of_lines[target_line_no - 1] += line;
          target_line_no++;
        } else {
          list_of_lines.push(line);
          target_line_no++;
        }
      }
    });

    line_reader.on('close', function () {
      if (delPreprocessed) execSync('rm ' + preprocessed);

      const result = list_of_lines.filter(a => a).join('\n') + '\n';
      resolve(result);
    });
  });
}

module.exports.clearPreprocessors = clearPreprocessors;

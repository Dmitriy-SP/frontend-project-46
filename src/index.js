import * as fs from 'node:fs';
import path from 'node:path';
import parse from './parses.js';
import buildDiff from './buildDiff.js';
import format from './formatters/index.js';

const getPath = (filePath) => fs.readFileSync(path.resolve(filePath));
const getType = (filePath) => filePath.slice(filePath.lastIndexOf('.') + 1);

const isTypesRight = (filePath1, filePath2) => {
  const file1Type = getType(filePath1);
  const file2Type = getType(filePath2);
  if (file1Type === 'json' && file2Type === 'json') {
    return true;
  }
  if ((file1Type === 'yaml' || file1Type === 'yml') && (file2Type === 'yaml' || file2Type === 'yml')) {
    return true;
  }
  return false;
};

const genDifferent = (filePath1, filePath2, formatName) => {
  if (isTypesRight) {
    const tree1 = parse(getPath(filePath1), getType(filePath1));
    const tree2 = parse(getPath(filePath2), getType(filePath2));
    const diff = buildDiff(tree1, tree2);
    return format(diff, formatName);
  }
  throw new Error('error, nonexistent file format.\nsupported formats: \'json\', \'yaml\'.');
};

export default genDifferent;

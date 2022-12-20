import * as fs from 'node:fs';
import path from 'node:path';
import parse from './parses.js';
import buildDiff from './buildDiff.js';
import format from './formatters/index.js';

const getPath = (filePath) => fs.readFileSync(path.resolve(filePath));
const getType = (filePath) => filePath.slice(filePath.lastIndexOf('.') + 1);

const genDifferent = (filePath1, filePath2, formatName = 'stylish') => {
  const tree1 = parse(getPath(filePath1), getType(filePath1));
  const tree2 = parse(getPath(filePath2), getType(filePath2));
  const diff = buildDiff(tree1, tree2);
  return format(diff, formatName);
};

export default genDifferent;

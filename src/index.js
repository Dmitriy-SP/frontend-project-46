import * as fs from 'node:fs';
import path from 'node:path';
import parse from './parses.js';
import buildDiff from './buildDiff.js';
import format from './formatters/index.js';

const getPath = (dataPath) => fs.readFileSync(path.resolve(dataPath));
const getType = (dataPath) => path.extname(dataPath).slice(1);

const genDiff = (dataPath1, datePath2, formatName = 'stylish') => {
  const tree1 = parse(getPath(dataPath1), getType(dataPath1));
  const tree2 = parse(getPath(datePath2), getType(datePath2));
  const diff = buildDiff(tree1, tree2);
  return format(diff, formatName);
};

export default genDiff;

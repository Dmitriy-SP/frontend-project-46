import _ from 'lodash';
import parseFile from './parses.js';
import buildDiff from './buildDiff.js';
import chouseFormatters from './formatters/index.js';

const genDifferent = (filePath1, filePath2, formatName) => {
  const tree1 = parseFile(filePath1);
  const tree2 = parseFile(filePath2);
  const keys = _.uniq([...Object.keys(tree1), ...Object.keys(tree2)]).sort();
  const diff = buildDiff(tree1, tree2, keys);
  return chouseFormatters(diff, formatName);
};

export default genDifferent;

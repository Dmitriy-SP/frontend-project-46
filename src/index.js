import * as fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';

export const genDifferent = (filePath1, filePath2) => {
  const path1 = path.resolve(filePath1);
  const path2 = path.resolve(filePath2);
  const json1 = JSON.parse(fs.readFileSync(path1, 'utf8'));
  const json2 = JSON.parse(fs.readFileSync(path2, 'utf8'));
  const keys = _.uniq([...Object.keys(json1), ...Object.keys(json2)]).sort();
  let diffString = '{\n';

  for (let i = 0; i < keys.length; i += 1) {
    if (Object.hasOwn(json1, keys[i]) && Object.hasOwn(json2, keys[i])) {
      if (json1[keys[i]] === json2[keys[i]]) {
        diffString += `    ${keys[i]}: ${json1[keys[i]]}\n`;
      } else {
        diffString += `  - ${keys[i]}: ${json1[keys[i]]}\n`;
        diffString += `  + ${keys[i]}: ${json2[keys[i]]}\n`;
      }
    } else if (Object.hasOwn(json1, keys[i])) {
      diffString += `  - ${keys[i]}: ${json1[keys[i]]}\n`;
    } else if (Object.hasOwn(json2, keys[i])) {
      diffString += `  + ${keys[i]}: ${json2[keys[i]]}\n`;
    }
  }
  diffString += '}';

  return diffString;
};

export default genDifferent;

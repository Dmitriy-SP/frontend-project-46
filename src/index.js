import _ from 'lodash';
import parseFile from './parses.js';

const toPlain = (diff) => {
  const result = [];
  diff.map((item) => {
    if (item.status === 'unchanged') { result.push(`    ${item.key}: ${item.value}`); }
    if (item.status === 'changed') {
      result.push(`  - ${item.key}: ${item.value}`);
      result.push(`  + ${item.key}: ${item.value2}`);
    }
    if (item.status === 'deleted') { result.push(`  - ${item.key}: ${item.value}`); }
    if (item.status === 'added') { result.push(`  + ${item.key}: ${item.value}`); }
    return null;
  });

  return `{\n${result.join('\n')}\n}`;
  /*
  const result = {};
  diff.map((item) => {
    if (item.status === 'unchanged')
    { const newKey = `  ${item.key}`; result[newKey] = item.value; }
    if (item.status === 'changed') {
      const minusKey = `- ${item.key}`;
      const plusKey = `+ ${item.key}`;
      result[minusKey] = item.value;
      result[plusKey] = item.value2;
    }
    if (item.status === 'deleted') { const newKey = `- ${item.key}`; result[newKey] = item.value; }
    if (item.status === 'added') { const newKey = `+ ${item.key}`; result[newKey] = item.value; }
    return null;
  });

  return result;
  */
};

export const genDifferent = (filePath1, filePath2) => {
  const json1 = parseFile(filePath1);
  const json2 = parseFile(filePath2);

  const keys = _.uniq([...Object.keys(json1), ...Object.keys(json2)]).sort();
  // let diffString = '{\n';

  const diff = keys.map((key) => {
    if (Object.hasOwn(json1, key) && Object.hasOwn(json2, key)) {
      if (json1[key] === json2[key]) {
        return { key, value: json1[key], status: 'unchanged' };
      }
      return {
        key, value: json1[key], value2: json2[key], status: 'changed',
      };
    }
    if (Object.hasOwn(json1, key)) {
      return { key, value: json1[key], status: 'deleted' };
    }
    return { key, value: json2[key], status: 'added' };
  });
  /*
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
*/
  return toPlain(diff);
};

export default genDifferent;

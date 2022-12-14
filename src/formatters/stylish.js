const makeIndent = (f) => {
  const file = f.split('\n');
  return file.map((str) => {
    if (str !== file[0]) {
      return `    ${str}`;
    }
    return str;
  }).join('\n');
};

const convert = (file) => {
  const newFile = JSON.stringify(file, null, 4);
  const unquoted = newFile.replaceAll('"', '');
  const result = makeIndent(unquoted);
  return result.replaceAll(',', '').trim();
};

const toStylish = (diff) => diff.map((node) => {
  if (node.status === 'node') {
    return `    ${node.key}: {\n    ${makeIndent(toStylish(node.children))}\n    }`;
  }
  if (node.status === 'unchanged') {
    return `    ${node.key}: ${convert(node.value)}`;
  }
  if (node.status === 'changed') {
    return `  - ${node.key}: ${convert(node.valueFirst)}\n  + ${node.key}: ${convert(node.valueSecond)}`;
  }
  if (node.status === 'added') {
    return `  + ${node.key}: ${convert(node.value)}`;
  }
  if (node.status === 'deleted') {
    return `  - ${node.key}: ${convert(node.value)}`;
  }
  return '';
})
  .filter((item) => item !== '')
  .join('\n');

export default (diff) => `{\n${toStylish(diff)}\n}`;

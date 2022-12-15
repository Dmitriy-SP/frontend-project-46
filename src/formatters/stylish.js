const addSpaceTo = (value) => {
  const valueArray = value.split('\n');
  return valueArray.map((item) => {
    if (item !== valueArray[0]) {
      return `    ${item}`;
    }
    return item;
  }).join('\n');
};

const convert = (value) => {
  const convertedValue = JSON.stringify(value, null, 4)
    .replaceAll('"', '')
    .replaceAll(',', '');
  return addSpaceTo(convertedValue);
};

const toStylish = (diff) => diff.map((node) => {
  if (node.status === 'node') {
    return `    ${node.key}: {\n    ${addSpaceTo(toStylish(node.children))}\n    }`;
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

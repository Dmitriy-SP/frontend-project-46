const addSpace = (desireLevel, level = 1, string = '') => {
  if (level < desireLevel) {
    return addSpace(desireLevel, level + 1, `    ${string}`);
  }
  return string;
};

const writeNote = (value, level) => {
  const item = JSON.stringify(value, null, 4)
    .replaceAll('"', '')
    .replaceAll(',', '');

  if (!item.includes('\n')) {
    return item;
  }
  return item.split('\n').map((a) => {
    if (a === '{') {
      return a;
    }
    return `${addSpace(level)}    ${a}`;
  }).join('\n');
};

const toStylish = (diff, level = 1) => diff.map((node) => {
  switch (node.status) {
    case 'node':
      return `${addSpace(level)}    ${node.key}: {\n${toStylish(node.children, level + 1)}\n${addSpace(level)}    }`;
    case 'changed':
      return `${addSpace(level)}  - ${node.key}: ${writeNote(node.value1, level)}\n${addSpace(level)}  + ${node.key}: ${writeNote(node.value2, level)}`;
    case 'unchanged':
      return `${addSpace(level)}    ${node.key}: ${writeNote(node.value, level)}`;
    case 'added':
      return `${addSpace(level)}  + ${node.key}: ${writeNote(node.value, level)}`;
    case 'deleted':
      return `${addSpace(level)}  - ${node.key}: ${writeNote(node.value, level)}`;
    default:
      throw new Error('error, unknown node status');
  }
})
  .filter((item) => item !== '')
  .join('\n');

export default (diff) => `{\n${toStylish(diff)}\n}`;

const buildValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const iterPlain = (node, path) => node.map((item) => {
  const fullPath = (path === '') ? `${item.key}` : `${path}.${item.key}`;
  switch (item.status) {
    case 'node':
      return iterPlain(item.children, fullPath);
    case 'unchanged':
      return '';
    case 'changed':
      return `Property '${fullPath}' was updated. From ${buildValue(item.value1)} to ${buildValue(item.value2)}`;
    case 'added':
      return `Property '${fullPath}' was added with value: ${buildValue(item.value)}`;
    case 'deleted':
      return `Property '${fullPath}' was removed`;
    default:
      throw new Error('error, unknown node status');
  }
})
  .filter((item) => item !== '')
  .join('\n');

const toPlain = (diff) => iterPlain(diff, '');

export default toPlain;

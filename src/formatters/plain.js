const buildValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const toPlain = (diff, path = '') => diff.map((node) => {
  const fullPath = (path === '') ? `${node.key}` : `${path}.${node.key}`;
  switch (node.status) {
    case 'node':
      return toPlain(node.children, fullPath);
    case 'unchanged':
      return '';
    case 'changed':
      return `Property '${fullPath}' was updated. From ${buildValue(node.value1)} to ${buildValue(node.value2)}`;
    case 'added':
      return `Property '${fullPath}' was added with value: ${buildValue(node.value)}`;
    case 'deleted':
      return `Property '${fullPath}' was removed`;
    default:
      throw new Error('error, unknown node status');
  }
})
  .filter((item) => item !== '')
  .join('\n');

export default toPlain;

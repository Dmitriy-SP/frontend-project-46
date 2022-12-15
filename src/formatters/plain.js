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
  if (node.status === 'node') {
    return toPlain(node.children, fullPath);
  }
  if (node.status === 'changed') {
    return `Property '${fullPath}' was updated. From ${buildValue(node.valueFirst)} to ${buildValue(node.valueSecond)}`;
  }
  if (node.status === 'added') {
    return `Property '${fullPath}' was added with value: ${buildValue(node.value)}`;
  }
  if (node.status === 'deleted') {
    return `Property '${fullPath}' was removed`;
  }
  return '';
})
  .filter((item) => item !== '')
  .join('\n');

export default toPlain;

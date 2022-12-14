import _ from 'lodash';

const valueWithQuotesIfNeeded = (incomeValue) => {
  if (incomeValue === '[complex value]') {
    return incomeValue;
  }
  return typeof incomeValue === 'string' ? `'${incomeValue}'` : incomeValue;
};

const buildNote = (path, type, status, value, valueAfter) => {
  const name = (type === 'node' ? _.slice(path, 0, path.length - 1).join('') : path);
  if (status === 'changed') {
    return `Property '${name}' was updated. From ${valueWithQuotesIfNeeded(value)} to ${valueWithQuotesIfNeeded(valueAfter)}`;
  }
  if (status === 'added') {
    return `Property '${name}' was added with value: ${valueWithQuotesIfNeeded(value)}`;
  }
  if (status === 'deleted') {
    return `Property '${name}' was removed`;
  }
  return '';
};

const buildLeaf = (leaf, path) => {
  if (leaf.status === 'changed') {
    return buildNote(`${path}${leaf.key}`, 'leaf', 'changed', leaf.valueBefore, leaf.valueAfter);
  }
  if (leaf.status === 'deleted') {
    return buildNote(`${path}${leaf.key}`, 'leaf', 'deleted');
  }
  if (leaf.status === 'added') {
    return buildNote(`${path}${leaf.key}`, 'leaf', 'added', leaf.value);
  }
  return '';
};

const buildNode = (node, path) => {
  if (node.status === 'changedToValue') {
    return buildNote(path, 'node', 'changed', '[complex value]', node.valueAfter);
  }
  if (node.status === 'changedToObject') {
    return buildNote(path, 'node', 'changed', node.valueBefore, '[complex value]');
  }
  if (node.status === 'added') {
    return buildNote(path, 'node', 'added', '[complex value]');
  }
  if (node.status === 'deleted') {
    return buildNote(path, 'node', 'deleted');
  }
  return '';
};

const toPlain = (diff, path = '') => diff.flatMap((item) => {
  if (item.type === 'node') {
    if (item.status === 'unchanged') {
      return toPlain(item.value, `${path}${item.key}.`);
    }
    return buildNode(item, `${path}${item.key}.`);
  }
  return buildLeaf(item, path);
});

export default (diff) => toPlain(diff)
  .filter((item) => item !== '')
  .join('\n');

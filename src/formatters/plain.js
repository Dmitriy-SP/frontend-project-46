const valueWithQuotesIfNeeded = (incomeValue) => {
  if (incomeValue === '[complex value]') {
    return incomeValue;
  }
  return typeof incomeValue === 'string' ? `'${incomeValue}'` : incomeValue;
};

const buildNote = (path, type, status, value, valueAfter) => {
  let name = path;
  if (type === 'node') {
    name = name.slice(0, path.lastIndexOf('.'));
  }
  let nodeString = '';
  if (status === 'changed') {
    nodeString = `Property '${name}' was updated. From ${valueWithQuotesIfNeeded(value)} to ${valueWithQuotesIfNeeded(valueAfter)}`;
  } else if (status === 'added') {
    nodeString = `Property '${name}' was added with value: ${valueWithQuotesIfNeeded(value)}`;
  } else if (status === 'deleted') {
    nodeString = `Property '${name}' was removed`;
  }
  return nodeString;
};

const buildLeaf = (leaf, path) => {
  let leafString = '';
  if (leaf.status === 'changed') {
    leafString = buildNote(`${path}${leaf.key}`, 'leaf', 'changed', leaf.valueBefore, leaf.valueAfter);
  } else if (leaf.status === 'deleted') {
    leafString = buildNote(`${path}${leaf.key}`, 'leaf', 'deleted');
  } else if (leaf.status === 'added') {
    leafString = buildNote(`${path}${leaf.key}`, 'leaf', 'added', leaf.value);
  }
  return leafString;
};

const buildNode = (node, path) => {
  let nodeString = '';
  if (node.status === 'changedToValue') {
    nodeString = buildNote(path, 'node', 'changed', '[complex value]', node.valueAfter);
  } else if (node.status === 'changedToObject') {
    nodeString = buildNote(path, 'node', 'changed', node.valueBefore, '[complex value]');
  } else if (node.status === 'added') {
    nodeString = buildNote(path, 'node', 'added', '[complex value]');
  } else if (node.status === 'deleted') {
    nodeString = buildNote(path, 'node', 'deleted');
  }
  return nodeString;
};

const toPlain = (diff, nodePath = '') => diff.flatMap((item) => {
  let path = nodePath;
  if (item.type === 'node') {
    path += `${item.key}.`;
    if (item.status === 'unchanged') {
      return toPlain(item.value, path);
    }
    return buildNode(item, path);
  }
  if (item.type === 'leaf') {
    return buildLeaf(item, path);
  }
  return '';
});

export default (diff) => toPlain(diff)
  .filter((item) => item !== '')
  .join('\n');

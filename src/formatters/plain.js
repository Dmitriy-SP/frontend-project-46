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
    nodeString = `Property '${name}' was updated. From ${valueWithQuotesIfNeeded(value)} to ${valueWithQuotesIfNeeded(valueAfter)}\n`;
  } else if (status === 'added') {
    nodeString = `Property '${name}' was added with value: ${valueWithQuotesIfNeeded(value)}\n`;
  } else if (status === 'deleted') {
    nodeString = `Property '${name}' was removed\n`;
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

const addNote = (type, object, path) => {
  if (type === 'node') {
    return buildNode(object, path);
  }
  if (type === 'leaf') {
    return buildLeaf(object, path);
  }
  return '';
};

const toPlain = (diff, nodePath = '') => {
  let result = '';
  for (let i = 0; i < diff.length; i += 1) {
    let path = nodePath;
    if (diff[i].type === 'node') {
      path += `${diff[i].key}.`;
      if (diff[i].status === 'unchanged') {
        result += toPlain(diff[i].value, path);
      } else {
        result += addNote('node', diff[i], path);
      }
    }

    if (diff[i].type === 'leaf') {
      result += addNote('leaf', diff[i], path);
    }
  }

  return result;
};

export default (diff) => toPlain(diff).slice(0, -1);

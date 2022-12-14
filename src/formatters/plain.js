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
  if (status === 'changed') {
    return `Property '${name}' was updated. From ${valueWithQuotesIfNeeded(value)} to ${valueWithQuotesIfNeeded(valueAfter)}\n`;
  }
  if (status === 'added') {
    return `Property '${name}' was added with value: ${valueWithQuotesIfNeeded(value)}\n`;
  }
  if (status === 'deleted') {
    return `Property '${name}' was removed\n`;
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

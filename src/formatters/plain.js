const valueWithQuotesIfNeeded = (incomeValue) => (typeof incomeValue === 'string' ? `'${incomeValue}'` : incomeValue);

const addLeaf = (leaf, path) => {
  if (leaf.status === 'changed') {
    return `Property '${path}${leaf.key}' was updated. From ${valueWithQuotesIfNeeded(leaf.valueBefore)} to ${valueWithQuotesIfNeeded(leaf.valueAfter)}\n`;
  }
  if (leaf.status === 'deleted') {
    return `Property '${path}${leaf.key}' was removed\n`;
  }
  if (leaf.status === 'added') {
    return `Property '${path}${leaf.key}' was added with value: ${valueWithQuotesIfNeeded(leaf.value)}\n`;
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
      }
      if (diff[i].status === 'changedToValue') {
        path = path.slice(0, path.lastIndexOf('.'));
        result += `Property '${path}' was updated. From [complex value] to ${valueWithQuotesIfNeeded(diff[i].valueAfter)}\n`;
      }
      if (diff[i].status === 'changedToObject') {
        path = path.slice(0, path.lastIndexOf('.'));
        result += `Property '${path}' was updated. From ${valueWithQuotesIfNeeded(diff[i].valueBefore)} to [complex value]\n`;
      }
      if (diff[i].status === 'added') {
        path = path.slice(0, path.lastIndexOf('.'));
        result += `Property '${path}' was added with value: [complex value]\n`;
      }
      if (diff[i].status === 'deleted') {
        path = path.slice(0, path.lastIndexOf('.'));
        result += `Property '${path}' was removed\n`;
      }
    }

    if (diff[i].type === 'leaf') {
      result += addLeaf(diff[i], path);
    }
  }

  return result;
};

export default (diff) => toPlain(diff).slice(0, -1);

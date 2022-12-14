const getSpaceLevel = (level) => {
  let spaceString = '';
  for (let i = 1; i < level; i += 1) {
    spaceString += '    ';
  }
  return spaceString;
};

const pushLeaf = (leaf, level, type = 'withMarks') => {
  if (type === 'withoutMarks') {
    return `${getSpaceLevel(level)}    ${leaf.key}: ${leaf.value}`;
  }
  if (leaf.status === 'unchanged') {
    return `${getSpaceLevel(level)}    ${leaf.key}: ${leaf.value}`;
  }
  if (leaf.status === 'deleted') {
    return `${getSpaceLevel(level)}  - ${leaf.key}: ${leaf.value}`;
  }
  if (leaf.status === 'added') {
    return `${getSpaceLevel(level)}  + ${leaf.key}: ${leaf.value}`;
  }
  if (leaf.status === 'changed') {
    return `${getSpaceLevel(level)}  - ${leaf.key}: ${leaf.valueBefore}\n${getSpaceLevel(level)}  + ${leaf.key}: ${leaf.valueAfter}`;
  }
  return '';
};

const pushNode = (name, level, status, nodeText, nodeTextAfter) => {
  if (status === 'unchanged') {
    return `${getSpaceLevel(level)}    ${name}: {\n${nodeText}\n${getSpaceLevel(level)}    }`;
  }
  if (status === 'changed') {
    return `${getSpaceLevel(level)}  - ${name}: ${nodeText}\n${getSpaceLevel(level)}  + ${name}: {\n${nodeTextAfter}\n${getSpaceLevel(level)}    }`;
  }
  if (status === 'added') {
    return `${getSpaceLevel(level)}  + ${name}: {\n${nodeText}\n${getSpaceLevel(level)}    }`;
  }
  if (status === 'deleted') {
    return `${getSpaceLevel(level)}  - ${name}: {\n${nodeText}\n${getSpaceLevel(level)}    }`;
  }
  if (status === 'withoutMarks') {
    return `${getSpaceLevel(level)}    ${name}: {\n${nodeText}\n${getSpaceLevel(level)}    }`;
  }
  return '';
};

const toStylishWithoutMarks = (diff, nodeLevel = 1) => {
  const result = [];
  const level = nodeLevel;
  for (let i = 0; i < diff.length; i += 1) {
    if (diff[i].type === 'node') {
      const nodeText = toStylishWithoutMarks(diff[i].value, level + 1);
      result.push(pushNode(diff[i].key, level, 'withoutMarks', nodeText));
    }
    if (diff[i].type === 'leaf') {
      result.push(pushLeaf(diff[i], level, 'withoutMarks'));
    }
  }
  return `${result.join('\n')}`;
};

const toStylish = (diff, nodeLevel = 1) => {
  const result = [];
  const level = nodeLevel;
  for (let i = 0; i < diff.length; i += 1) {
    if (diff[i].type === 'node') {
      if (diff[i].status === 'unchanged') {
        const nodeText = toStylish(diff[i].value, level + 1);
        result.push(pushNode(diff[i].key, level, 'unchanged', nodeText));
      }
      if (diff[i].status === 'changedToValue') {
        const nodeTextBefore = toStylishWithoutMarks(diff[i].valueBefore, level + 1);
        result.push(pushNode(diff[i].key, level, 'changed', diff[i].valueAfter, nodeTextBefore));
      }
      if (diff[i].status === 'changedToObject') {
        const nodeTextAfter = toStylishWithoutMarks(diff[i].valueAfter, level + 1);
        result.push(pushNode(diff[i].key, level, 'changed', nodeTextAfter, diff[i].valueBefore));
      }
      if (diff[i].status === 'added') {
        const nodeText = toStylishWithoutMarks(diff[i].value, level + 1);
        result.push(pushNode(diff[i].key, level, 'added', nodeText));
      }
      if (diff[i].status === 'deleted') {
        const nodeText = toStylishWithoutMarks(diff[i].value, level + 1);
        result.push(pushNode(diff[i].key, level, 'deleted', nodeText));
      }
    }

    if (diff[i].type === 'leaf') {
      result.push(pushLeaf(diff[i], level));
    }
  }

  return `${result.join('\n')}`;
};

export default (diff) => `{\n${toStylish(diff)}\n}`;

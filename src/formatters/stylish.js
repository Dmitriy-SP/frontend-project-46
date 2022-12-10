const getSpaceLevel = (level) => {
  let spaceString = '';
  for (let i = 1; i < level; i += 1) {
    spaceString += '    ';
  }
  return spaceString;
};

const toStylishWithoutMarks = (diff, nodeLevel = 1) => {
  const result = [];
  const level = nodeLevel;
  for (let i = 0; i < diff.length; i += 1) {
    if (diff[i].type === 'node') {
      const nodeText = toStylishWithoutMarks(diff[i].value, level + 1);
      result.push(`${getSpaceLevel(level)}    ${diff[i].key}: {\n${nodeText}\n${getSpaceLevel(level)}    }`);
    }

    if (diff[i].type === 'leaf') {
      result.push(`${getSpaceLevel(level)}    ${diff[i].key}: ${diff[i].value}`);
    }
  }
  return `${result.join('\n')}`;
};

const pushLeaf = (leaf, level) => {
  if (leaf.status === 'unchanged') {
    return `${getSpaceLevel(level)}    ${leaf.key}: ${leaf.value}`;
  }
  if (leaf.status === 'deleted') {
    return `${getSpaceLevel(level)}  - ${leaf.key}: ${leaf.value}`;
  }
  if (leaf.status === 'added') {
    return `${getSpaceLevel(level)}  + ${leaf.key}: ${leaf.value}`;
  }
  return `${getSpaceLevel(level)}  - ${leaf.key}: ${leaf.valueBefore}\n${getSpaceLevel(level)}  + ${leaf.key}: ${leaf.valueAfter}`;
};

const toStylish = (diff, nodeLevel = 1) => {
  const result = [];
  const level = nodeLevel;
  for (let i = 0; i < diff.length; i += 1) {
    if (diff[i].type === 'node') {
      if (diff[i].status === 'unchanged') {
        const nodeText = toStylish(diff[i].value, level + 1);
        result.push(`${getSpaceLevel(level)}    ${diff[i].key}: {\n${nodeText}\n${getSpaceLevel(level)}    }`);
      }
      if (diff[i].status === 'changedToValue') {
        const nodeTextBefore = toStylishWithoutMarks(diff[i].valueBefore, level + 1);
        result.push(`${getSpaceLevel(level)}  - ${diff[i].key}: ${diff[i].valueAfter}`);
        result.push(`${getSpaceLevel(level)}  + ${diff[i].key}: {\n${nodeTextBefore}\n${getSpaceLevel(level)}    }`);
      }
      if (diff[i].status === 'changedToObject') {
        const nodeTextAfter = toStylishWithoutMarks(diff[i].valueAfter, level + 1);
        result.push(`${getSpaceLevel(level)}  - ${diff[i].key}: {\n${getSpaceLevel(level)}${nodeTextAfter}\n${getSpaceLevel(level)}    }`);
        result.push(`${getSpaceLevel(level)}  + ${diff[i].key}: ${diff[i].valueBefore}\n`);
      }
      if (diff[i].status === 'added') {
        const nodeText = toStylishWithoutMarks(diff[i].value, level + 1);
        result.push(`${getSpaceLevel(level)}  + ${diff[i].key}: {\n${nodeText}\n${getSpaceLevel(level)}    }`);
      }
      if (diff[i].status === 'deleted') {
        const nodeText = toStylishWithoutMarks(diff[i].value, level + 1);
        result.push(`${getSpaceLevel(level)}  - ${diff[i].key}: {\n${nodeText}\n${getSpaceLevel(level)}    }`);
      }
    }

    if (diff[i].type === 'leaf') {
      result.push(pushLeaf(diff[i], level));
    }
  }

  return `${result.join('\n')}`;
};

export default (diff) => `{\n${toStylish(diff)}\n}`;

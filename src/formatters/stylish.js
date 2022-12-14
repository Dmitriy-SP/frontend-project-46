const getNoteLevel = (level) => {
  let spaceString = '';
  for (let i = 1; i < level; i += 1) {
    spaceString += '    ';
  }
  return spaceString;
};

const buildLeaf = (leaf, level, type = 'withMarks') => {
  let leafString = '';
  if (type === 'withoutMarks') {
    leafString = `${getNoteLevel(level)}    ${leaf.key}: ${leaf.value}`;
  } else if (leaf.status === 'unchanged') {
    leafString = `${getNoteLevel(level)}    ${leaf.key}: ${leaf.value}`;
  } else if (leaf.status === 'deleted') {
    leafString = `${getNoteLevel(level)}  - ${leaf.key}: ${leaf.value}`;
  } else if (leaf.status === 'added') {
    leafString = `${getNoteLevel(level)}  + ${leaf.key}: ${leaf.value}`;
  } else if (leaf.status === 'changed') {
    leafString = `${getNoteLevel(level)}  - ${leaf.key}: ${leaf.valueBefore}\n`;
    leafString += `${getNoteLevel(level)}  + ${leaf.key}: ${leaf.valueAfter}`;
  }
  return leafString;
};

const buildNode = (name, level, status, nodeText, nodeTextAfter) => {
  let nodeString = '';
  if (status === 'unchanged') {
    nodeString = `${getNoteLevel(level)}    ${name}: {\n${nodeText}\n${getNoteLevel(level)}    }`;
  } else if (status === 'changed') {
    nodeString = `${getNoteLevel(level)}  - ${name}: ${nodeText}\n`;
    nodeString += `${getNoteLevel(level)}  + ${name}: {\n${nodeTextAfter}\n${getNoteLevel(level)}    }`;
  } else if (status === 'added') {
    nodeString = `${getNoteLevel(level)}  + ${name}: {\n${nodeText}\n${getNoteLevel(level)}    }`;
  } else if (status === 'deleted') {
    nodeString = `${getNoteLevel(level)}  - ${name}: {\n${nodeText}\n${getNoteLevel(level)}    }`;
  } else if (status === 'withoutMarks') {
    nodeString = `${getNoteLevel(level)}    ${name}: {\n${nodeText}\n${getNoteLevel(level)}    }`;
  }
  return nodeString;
};

const toStylishWithoutMarks = (diff, level = 1) => diff.flatMap((item) => {
  if (item.type === 'node') {
    const nodeText = toStylishWithoutMarks(item.value, level + 1);
    return buildNode(item.key, level, 'withoutMarks', nodeText);
  }
  return buildLeaf(item, level, 'withoutMarks');
})
  .filter((item) => item !== '')
  .join('\n');

const buildNote = (node, level) => {
  let nodeString = '';
  if (node.status === 'changedToValue') {
    const nodeTextBefore = toStylishWithoutMarks(node.valueBefore, level + 1);
    nodeString = buildNode(node.key, level, 'changed', node.valueAfter, nodeTextBefore);
  } else if (node.status === 'changedToObject') {
    const nodeTextAfter = toStylishWithoutMarks(node.valueAfter, level + 1);
    nodeString = buildNode(node.key, level, 'changed', node.valueBefore, nodeTextAfter);
  } else {
    const nodeText = toStylishWithoutMarks(node.value, level + 1);
    if (node.status === 'added') {
      nodeString = buildNode(node.key, level, 'added', nodeText);
    } else if (node.status === 'deleted') {
      nodeString = buildNode(node.key, level, 'deleted', nodeText);
    }
  }
  return nodeString;
};

const toStylish = (diff, level = 1) => diff.flatMap((item) => {
  if (item.type === 'node') {
    if (item.status === 'unchanged') {
      const nodeText = toStylish(item.value, level + 1);
      return buildNode(item.key, level, 'unchanged', nodeText);
    }
    return buildNote(item, level);
  }
  return buildLeaf(item, level);
})
  .filter((item) => item !== '')
  .join('\n');

export default (diff) => `{\n${toStylish(diff)}\n}`;

import _ from 'lodash';

const getNoteLevel = (level) => {
  const spaceArray = [];
  spaceArray.length = level - 1;
  return _.fill(spaceArray, '    ').join('');
};

const buildLeaf = (leaf, level, type = 'withMarks') => {
  if (type === 'withoutMarks') {
    return `${getNoteLevel(level)}    ${leaf.key}: ${leaf.value}`;
  }
  if (leaf.status === 'unchanged') {
    return `${getNoteLevel(level)}    ${leaf.key}: ${leaf.value}`;
  }
  if (leaf.status === 'deleted') {
    return `${getNoteLevel(level)}  - ${leaf.key}: ${leaf.value}`;
  }
  if (leaf.status === 'added') {
    return `${getNoteLevel(level)}  + ${leaf.key}: ${leaf.value}`;
  }
  if (leaf.status === 'changed') {
    return `${getNoteLevel(level)}  - ${leaf.key}: ${leaf.valueBefore}\n${getNoteLevel(level)}  + ${leaf.key}: ${leaf.valueAfter}`;
  }
  return '';
};

const buildNode = (name, level, status, nodeText, nodeTextAfter) => {
  if (status === 'unchanged') {
    return `${getNoteLevel(level)}    ${name}: {\n${nodeText}\n${getNoteLevel(level)}    }`;
  }
  if (status === 'changedToValue') {
    return `${getNoteLevel(level)}  - ${name}: {\n${nodeTextAfter}\n${getNoteLevel(level)}    }\n${getNoteLevel(level)}  + ${name}: ${nodeText}`;
  }
  if (status === 'changedToObject') {
    return `${getNoteLevel(level)}  - ${name}: ${nodeText}\n${getNoteLevel(level)}  + ${name}: {\n${nodeTextAfter}\n${getNoteLevel(level)}    }`;
  }
  if (status === 'added') {
    return `${getNoteLevel(level)}  + ${name}: {\n${nodeText}\n${getNoteLevel(level)}    }`;
  }
  if (status === 'deleted') {
    return `${getNoteLevel(level)}  - ${name}: {\n${nodeText}\n${getNoteLevel(level)}    }`;
  }
  if (status === 'withoutMarks') {
    return `${getNoteLevel(level)}    ${name}: {\n${nodeText}\n${getNoteLevel(level)}    }`;
  }
  return '';
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
  if (node.status === 'changedToValue') {
    const nodeTextBefore = toStylishWithoutMarks(node.valueBefore, level + 1);
    return buildNode(node.key, level, 'changedToValue', node.valueAfter, nodeTextBefore);
  }
  if (node.status === 'changedToObject') {
    const nodeTextAfter = toStylishWithoutMarks(node.valueAfter, level + 1);
    return buildNode(node.key, level, 'changedToObject', node.valueBefore, nodeTextAfter);
  }
  const nodeText = toStylishWithoutMarks(node.value, level + 1);
  if (node.status === 'added') {
    return buildNode(node.key, level, 'added', nodeText);
  }
  if (node.status === 'deleted') {
    return buildNode(node.key, level, 'deleted', nodeText);
  }
  return '';
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

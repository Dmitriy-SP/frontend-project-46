const getSpaceLevel = (level) => {
  let spaceString = '';
  for (let i = 1; i < level; i += 1) {
    spaceString += '    ';
  }
  return spaceString;
};

const pushLeaf = (leaf, level, type = 'withMarks') => {
  let leafString = '';
  if (type === 'withoutMarks') {
    leafString = `${getSpaceLevel(level)}    ${leaf.key}: ${leaf.value}`;
  } else if (leaf.status === 'unchanged') {
    leafString = `${getSpaceLevel(level)}    ${leaf.key}: ${leaf.value}`;
  } else if (leaf.status === 'deleted') {
    leafString = `${getSpaceLevel(level)}  - ${leaf.key}: ${leaf.value}`;
  } else if (leaf.status === 'added') {
    leafString = `${getSpaceLevel(level)}  + ${leaf.key}: ${leaf.value}`;
  } else if (leaf.status === 'changed') {
    leafString = `${getSpaceLevel(level)}  - ${leaf.key}: ${leaf.valueBefore}\n`;
    leafString += `${getSpaceLevel(level)}  + ${leaf.key}: ${leaf.valueAfter}`;
  }
  return `${leafString}\n`;
};

const pushNode = (name, level, status, nodeText, nodeTextAfter) => {
  let nodeString = '';
  if (status === 'unchanged') {
    nodeString = `${getSpaceLevel(level)}    ${name}: {\n${nodeText}\n${getSpaceLevel(level)}    }\n`;
  } else if (status === 'changed') {
    nodeString = `${getSpaceLevel(level)}  - ${name}: ${nodeText}\n`;
    nodeString += `${getSpaceLevel(level)}  + ${name}: {\n${nodeTextAfter}\n${getSpaceLevel(level)}    }\n`;
  } else if (status === 'added') {
    nodeString = `${getSpaceLevel(level)}  + ${name}: {\n${nodeText}\n${getSpaceLevel(level)}    }\n`;
  } else if (status === 'deleted') {
    nodeString = `${getSpaceLevel(level)}  - ${name}: {\n${nodeText}\n${getSpaceLevel(level)}    }\n`;
  } else if (status === 'withoutMarks') {
    nodeString = `${getSpaceLevel(level)}    ${name}: {\n${nodeText}\n${getSpaceLevel(level)}    }\n`;
  }
  return nodeString;
};

const toStylishWithoutMarks = (diff, nodeLevel = 1) => {
  // const result = [];
  let result = '';
  for (let i = 0; i < diff.length; i += 1) {
    if (diff[i].type === 'node') {
      const nodeText = toStylishWithoutMarks(diff[i].value, nodeLevel + 1);
      result += pushNode(diff[i].key, nodeLevel, 'withoutMarks', nodeText);
      // result.push(pushNode(diff[i].key, nodeLevel, 'withoutMarks', nodeText));
    }
    if (diff[i].type === 'leaf') {
      result += pushLeaf(diff[i], nodeLevel, 'withoutMarks');
      // result.push(pushLeaf(diff[i], nodeLevel, 'withoutMarks'));
    }
  }
  return result.slice(0, -1);
  // return `${result.join('\n')}`;
};

const addNode = (node, level) => {
  let nodeString = '';
  if (node.status === 'changedToValue') {
    const nodeTextBefore = toStylishWithoutMarks(node.valueBefore, level + 1);
    nodeString = pushNode(node.key, level, 'changed', node.valueAfter, nodeTextBefore);
  } else if (node.status === 'changedToObject') {
    const nodeTextAfter = toStylishWithoutMarks(node.valueAfter, level + 1);
    nodeString = pushNode(node.key, level, 'changed', nodeTextAfter, node.valueBefore);
  } else {
    const nodeText = toStylishWithoutMarks(node.value, level + 1);
    if (node.status === 'added') {
      nodeString = pushNode(node.key, level, 'added', nodeText);
    } else if (node.status === 'deleted') {
      nodeString = pushNode(node.key, level, 'deleted', nodeText);
    }
  }
  return nodeString;
};

const toStylish = (diff, nodeLevel = 1) => {
  // const result = [];
  let result = '';
  const level = nodeLevel;
  for (let i = 0; i < diff.length; i += 1) {
    if (diff[i].type === 'node') {
      if (diff[i].status === 'unchanged') {
        const nodeText = toStylish(diff[i].value, level + 1);
        result += pushNode(diff[i].key, level, 'unchanged', nodeText);
        // result.push(pushNode(diff[i].key, level, 'unchanged', nodeText));
      } else {
        result += addNode(diff[i], level);
        // result.push(addNode(diff[i], level));
      }
    }

    if (diff[i].type === 'leaf') {
      result += pushLeaf(diff[i], level);
      // result.push(pushLeaf(diff[i], level));
    }
  }
  return result.slice(0, -1);
  // return `${result.join('\n')}`;
};

export default (diff) => `{\n${toStylish(diff)}\n}`;

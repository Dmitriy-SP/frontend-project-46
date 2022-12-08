import _ from 'lodash';

const getLeafDiff = (node1, node2, key) => {
  if (Object.hasOwn(node1, key) && Object.hasOwn(node2, key)) {
    if (node1[key] === node2[key]) {
      return { key, value: node1[key], status: 'unchanged' };
    }
    return {
      key, valueBefore: node1[key], valueAfter: node2[key], status: 'changed',
    };
  }

  if (Object.hasOwn(node1, key)) {
    return { key, value: node1[key], status: 'deleted' };
  }

  return { key, value: node2[key], status: 'added' };
};

const buildDiff = (tree1, tree2) => {
  const keys = _.uniq([...Object.keys(tree1), ...Object.keys(tree2)]).sort();

  const diff = keys.map((key) => getLeafDiff(tree1, tree2, key));
  return diff;
};

export default buildDiff;

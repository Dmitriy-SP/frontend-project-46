import _ from 'lodash';

const getKeys = (keys1, keys2 = undefined) => {
  if (keys2 !== undefined) {
    return _.uniq([...Object.keys(keys1), ...Object.keys(keys2)]).sort();
  }
  return _.uniq([...Object.keys(keys1)]).sort();
};

const buildPoint = (type, status, key, value, otherValue) => {
  if (status !== 'changed' && status !== 'changedToValue' && status !== 'changedToObject') {
    return {
      type, key, value, status,
    };
  }
  return {
    type, key, valueBefore: value, valueAfter: otherValue, status,
  };
};

const getLeafDiff = (node1, node2, key) => {
  if (Object.hasOwn(node1, key) && Object.hasOwn(node2, key)) {
    if (node1[key] === node2[key]) {
      return buildPoint('leaf', 'unchanged', key, node1[key]);
    }
    return buildPoint('leaf', 'changed', key, node1[key], node2[key]);
  }
  if (Object.hasOwn(node1, key)) {
    return buildPoint('leaf', 'deleted', key, node1[key]);
  }
  return buildPoint('leaf', 'added', key, node2[key]);
};

const hasBothNode = (obj1, obj2, key) => (Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key));
const isBothNode = (value1, value2) => (typeof value1 === 'object' && typeof value2 === 'object');
const isNotNull = (object) => !Object.is(object, null);
const hasInnerNode = (object, key) => (Object.hasOwn(object, key) && typeof object[key] === 'object');

const buildDiff = (tree1, tree2, keys) => keys.map((key) => {
  if (hasBothNode(tree1, tree2, key)) {
    if (isBothNode(tree1[key], tree2[key])) {
      const nodeKeys = getKeys(tree1[key], tree2[key]);
      const nodeValue = buildDiff(tree1[key], tree2[key], nodeKeys);
      return buildPoint('node', 'unchanged', key, nodeValue);
    }
    if (typeof tree1[key] === 'object' && typeof tree2[key] !== 'object' && isNotNull(tree1[key])) {
      const nodeKeys = getKeys(tree1[key]);
      const nodeValue = buildDiff(tree1[key], tree2, nodeKeys);
      return buildPoint('node', 'changedToValue', key, nodeValue, tree2[key]);
    }
    if (typeof tree1[key] !== 'object' && typeof tree2[key] === 'object' && isNotNull(tree2[key])) {
      const nodeKeys = getKeys(tree2[key]);
      const nodeValue = buildDiff(tree1, tree2[key], nodeKeys);
      return buildPoint('node', 'changedToObject', key, nodeValue, tree2[key]);
    }
  }

  if (hasInnerNode(tree1, key) && isNotNull(tree1[key])) {
    const nodeKeys = getKeys(tree1[key]);
    const nodeValue = buildDiff(tree1[key], tree2, nodeKeys);
    return buildPoint('node', 'deleted', key, nodeValue);
  }

  if (hasInnerNode(tree2, key) && isNotNull(tree2[key])) {
    const nodeKeys = getKeys(tree2[key]);
    const nodeValue = buildDiff(tree1, tree2[key], nodeKeys);
    return buildPoint('node', 'added', key, nodeValue);
  }

  return getLeafDiff(tree1, tree2, key);
});

export default buildDiff;

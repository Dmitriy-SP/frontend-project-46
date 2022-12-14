import _ from 'lodash';

const buildKeys = (keys1, keys2 = undefined) => {
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
const isNodeAndLeaf = (obj1, obj2) => (typeof obj1 === 'object' && typeof obj2 !== 'object');
const isNotNull = (object) => !Object.is(object, null);
const hasInnerNode = (object, key) => (Object.hasOwn(object, key) && typeof object[key] === 'object');

const buildDiff = (tree1, tree2, keys) => keys.map((key) => {
  let point = '';
  if (hasBothNode(tree1, tree2, key)) {
    if (isBothNode(tree1[key], tree2[key])) {
      const nodeKeys = buildKeys(tree1[key], tree2[key]);
      const nodeValue = buildDiff(tree1[key], tree2[key], nodeKeys);
      point = buildPoint('node', 'unchanged', key, nodeValue);
    } else if (isNodeAndLeaf(tree1[key], tree2[key]) && isNotNull(tree1[key])) {
      const nodeKeys = buildKeys(tree1[key]);
      const nodeValue = buildDiff(tree1[key], tree2, nodeKeys);
      point = buildPoint('node', 'changedToValue', key, nodeValue, tree2[key]);
    } else if (isNodeAndLeaf(tree2[key], tree1[key]) && isNotNull(tree2[key])) {
      const nodeKeys = buildKeys(tree2[key]);
      const nodeValue = buildDiff(tree1, tree2[key], nodeKeys);
      point = buildPoint('node', 'changedToObject', key, tree1[key], nodeValue);
    }
  } else if (hasInnerNode(tree1, key) && isNotNull(tree1[key])) {
    const nodeKeys = buildKeys(tree1[key]);
    const nodeValue = buildDiff(tree1[key], tree2, nodeKeys);
    point = buildPoint('node', 'deleted', key, nodeValue);
  } else if (hasInnerNode(tree2, key) && isNotNull(tree2[key])) {
    const nodeKeys = buildKeys(tree2[key]);
    const nodeValue = buildDiff(tree1, tree2[key], nodeKeys);
    point = buildPoint('node', 'added', key, nodeValue);
  }

  if (point === '') {
    point = getLeafDiff(tree1, tree2, key);
  }

  return point;
});

export default buildDiff;

import _ from 'lodash';

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

const buildDiff = (tree1, tree2, keys) => {
  const diff = keys.map((key) => {
    if (Object.hasOwn(tree1, key) && Object.hasOwn(tree2, key)) {
      if (typeof tree1[key] === 'object' && typeof tree2[key] === 'object') {
        const nodeKeys = _.uniq([...Object.keys(tree1[key]), ...Object.keys(tree2[key])]).sort();
        const nodeValue = buildDiff(tree1[key], tree2[key], nodeKeys);
        return buildPoint('node', 'unchanged', key, nodeValue);
      }
      if (typeof tree1[key] === 'object' && typeof tree2[key] !== 'object' && !Object.is(tree1[key], null)) {
        const nodeKeys = _.uniq([...Object.keys(tree1[key])]).sort();
        const nodeValue = buildDiff(tree1[key], tree2, nodeKeys);
        return buildPoint('node', 'changedToValue', key, nodeValue, tree2[key]);
      }
      if (typeof tree1[key] !== 'object' && typeof tree2[key] === 'object' && !Object.is(tree2[key], null)) {
        const nodeKeys = _.uniq([...Object.keys(tree2[key])]).sort();
        const nodeValue = buildDiff(tree1, tree2[key], nodeKeys);
        return buildPoint('node', 'changedToObject', key, nodeValue, tree2[key]);
      }
    }

    if (Object.hasOwn(tree1, key) && typeof tree1[key] === 'object' && !Object.is(tree1[key], null)) {
      const nodeKeys = _.uniq([...Object.keys(tree1[key])]).sort();
      const nodeValue = buildDiff(tree1[key], tree2, nodeKeys);
      return buildPoint('node', 'deleted', key, nodeValue);
    }

    if (Object.hasOwn(tree2, key) && typeof tree2[key] === 'object' && !Object.is(tree2[key], null)) {
      const nodeKeys = _.uniq([...Object.keys(tree2[key])]).sort();
      const nodeValue = buildDiff(tree1, tree2[key], nodeKeys);
      return buildPoint('node', 'added', key, nodeValue);
    }

    return getLeafDiff(tree1, tree2, key);
  });
  return diff;
};

export default buildDiff;

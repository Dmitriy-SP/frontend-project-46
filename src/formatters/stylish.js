export default (diff) => {
  const result = [];
  diff.map((item) => {
    if (item.status === 'unchanged') { result.push(`    ${item.key}: ${item.value}`); }
    if (item.status === 'changed') {
      result.push(`  - ${item.key}: ${item.valueBefore}`);
      result.push(`  + ${item.key}: ${item.valueAfter}`);
    }
    if (item.status === 'deleted') { result.push(`  - ${item.key}: ${item.value}`); }
    if (item.status === 'added') { result.push(`  + ${item.key}: ${item.value}`); }
    return null;
  });

  return `{\n${result.join('\n')}\n}`;
};

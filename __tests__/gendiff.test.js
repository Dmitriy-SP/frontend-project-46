import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

test('gendiff flat', () => {
  const filepath1 = '__tests__/__fixtures__/file1.json';
  const filepath2 = '__tests__/__fixtures__/file2.json';
  const example = '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}';
  expect(genDiff(filepath1, filepath2)).toEqual(example);
});

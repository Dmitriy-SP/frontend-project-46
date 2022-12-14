import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const exampleStylish = '{\n    common: {\n      + follow: false\n        setting1: Value 1\n      - setting2: 200\n      - setting3: true\n      + setting3: null\n      + setting4: blah blah\n      + setting5: {\n            key5: value5\n        }\n        setting6: {\n            doge: {\n              - wow: \n              + wow: so much\n            }\n            key: value\n          + ops: vops\n        }\n    }\n    group1: {\n      - baz: bas\n      + baz: bars\n        foo: bar\n      - nest: str\n      + nest: {\n            key: value\n        }\n    }\n  - group2: {\n        abc: 12345\n        deep: {\n            id: 45\n        }\n    }\n  + group3: {\n        deep: {\n            id: {\n                number: 45\n            }\n        }\n        fee: 100500\n    }\n}';
const examplePlain = 'Property \'common.follow\' was added with value: false\nProperty \'common.setting2\' was removed\nProperty \'common.setting3\' was updated. From true to null\nProperty \'common.setting4\' was added with value: \'blah blah\'\nProperty \'common.setting5\' was added with value: [complex value]\nProperty \'common.setting6.doge.wow\' was updated. From \'\' to \'so much\'\nProperty \'common.setting6.ops\' was added with value: \'vops\'\nProperty \'group1.baz\' was updated. From \'bas\' to \'bars\'\nProperty \'group1.nest\' was updated. From [complex value] to \'str\'\nProperty \'group2\' was removed\nProperty \'group3\' was added with value: [complex value]';
const filepath1JSON = '__tests__/__fixtures__/file1.json';
const filepath2JSON = '__tests__/__fixtures__/file2.json';
const filepath1Yaml = '__tests__/__fixtures__/file1.yaml';
const filepath2Yaml = '__tests__/__fixtures__/file2.yml';

test('gendiff json, stylish', () => {
  expect(genDiff(filepath1JSON, filepath2JSON, 'stylish')).toEqual(exampleStylish);
});

test('gendiff yaml, stylish', () => {
  expect(genDiff(filepath1Yaml, filepath2Yaml, 'stylish')).toEqual(exampleStylish);
});

test('gendiff mixed, stylish', () => {
  expect(genDiff(filepath1Yaml, filepath2JSON, 'stylish')).toEqual(exampleStylish);
});

test('gendiff json, plain', () => {
  expect(genDiff(filepath1JSON, filepath2JSON, 'plain')).toEqual(examplePlain);
});

test('gendiff yaml, plain', () => {
  expect(genDiff(filepath1Yaml, filepath2Yaml, 'plain')).toEqual(examplePlain);
});

test('gendiff mixed, plain', () => {
  expect(genDiff(filepath1JSON, filepath2Yaml, 'plain')).toEqual(examplePlain);
});

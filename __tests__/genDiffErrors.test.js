import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const filepath1JSON = '__tests__/__fixtures__/file1.json';
const filepath2JSON = '__tests__/__fixtures__/file2.json';
const filepath1Yaml = '__tests__/__fixtures__/file1.yaml';
const filepath2Yaml = '__tests__/__fixtures__/file2.yml';

test('nonexistent file format with JSON', () => {
  const exampleError = 'error, nonexistent format.\nsupported formats: \'stylish\', \'plain\'.';
  expect(genDiff(filepath1JSON, filepath2JSON, 'txt')).toEqual(exampleError);
});

test('nonexistent file format with JSON', () => {
  const exampleError = 'error, nonexistent format.\nsupported formats: \'stylish\', \'plain\'.';
  expect(genDiff(filepath1Yaml, filepath2Yaml, 'txt')).toEqual(exampleError);
});

test('nonexistent formaters with JSON', () => {
  const exampleError = 'error, nonexistent file format.\nsupported formats: \'json\', \'yaml\'.';
  expect(genDiff(filepath1JSON, './__tests__/__fixtures__/exampleJSON.txt', 'json')).toEqual(exampleError);
});

test('nonexistent formaters with JSON', () => {
  const exampleError = 'error, nonexistent file format.\nsupported formats: \'json\', \'yaml\'.';
  expect(genDiff(filepath1Yaml, './__tests__/__fixtures__/exampleJSON.txt', 'json')).toEqual(exampleError);
});

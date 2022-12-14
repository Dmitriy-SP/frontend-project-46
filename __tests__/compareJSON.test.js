import { test, expect } from '@jest/globals';
import * as fs from 'node:fs';
import genDiff from '../src/index.js';

const exampleStylish = fs.readFileSync('./__tests__/__fixtures__/exampleStylish.txt', 'utf8').replaceAll('\r', '');
const examplePlain = fs.readFileSync('./__tests__/__fixtures__/examplePlain.txt', 'utf8').replaceAll('\r', '');
const exampleStylishReverse = fs.readFileSync('./__tests__/__fixtures__/exampleStylishReverse.txt', 'utf8').replaceAll('\r', '');
const examplePlainReverse = fs.readFileSync('./__tests__/__fixtures__/examplePlainReverse.txt', 'utf8').replaceAll('\r', '');
const exampleJSON = fs.readFileSync('./__tests__/__fixtures__/exampleJSON.txt', 'utf8').replaceAll('\r', '');

const filepath1JSON = '__tests__/__fixtures__/file1.json';
const filepath2JSON = '__tests__/__fixtures__/file2.json';

test('compare JSON with default formatters', () => {
  expect(genDiff(filepath1JSON, filepath2JSON)).toEqual(exampleStylish);
});

test('compare reverse JSON with default formatters', () => {
  expect(genDiff(filepath2JSON, filepath1JSON)).toEqual(exampleStylishReverse);
});

test('compare JSON with stylish formatters', () => {
  expect(genDiff(filepath1JSON, filepath2JSON, 'stylish')).toEqual(exampleStylish);
});

test('compare JSON with plain formatters', () => {
  expect(genDiff(filepath1JSON, filepath2JSON, 'plain')).toEqual(examplePlain);
});

test('compare reverse JSON with plain formatters', () => {
  expect(genDiff(filepath2JSON, filepath1JSON, 'plain')).toEqual(examplePlainReverse);
});

test('compare JSON with json formatters', () => {
  expect(genDiff(filepath1JSON, filepath2JSON, 'json')).toEqual(exampleJSON);
});

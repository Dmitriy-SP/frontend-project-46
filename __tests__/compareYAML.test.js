import { test, expect } from '@jest/globals';
import * as fs from 'node:fs';
import genDiff from '../src/index.js';

const exampleStylish = fs.readFileSync('./__tests__/__fixtures__/exampleStylish.txt', 'utf8').replaceAll('\r', '');
const examplePlain = fs.readFileSync('./__tests__/__fixtures__/examplePlain.txt', 'utf8').replaceAll('\r', '');
const exampleStylishReverse = fs.readFileSync('./__tests__/__fixtures__/exampleStylishReverse.txt', 'utf8').replaceAll('\r', '');
const examplePlainReverse = fs.readFileSync('./__tests__/__fixtures__/examplePlainReverse.txt', 'utf8').replaceAll('\r', '');
const exampleJSON = fs.readFileSync('./__tests__/__fixtures__/exampleJSON.txt', 'utf8').replaceAll('\r', '');

const filepath1Yaml = '__tests__/__fixtures__/file1.yaml';
const filepath2Yaml = '__tests__/__fixtures__/file2.yml';

test('compare YAML with default formatters', () => {
  expect(genDiff(filepath1Yaml, filepath2Yaml)).toEqual(exampleStylish);
});

test('compare reverse YAML with default formatters', () => {
  expect(genDiff(filepath2Yaml, filepath1Yaml)).toEqual(exampleStylishReverse);
});

test('compare YAML with stylish formatters', () => {
  expect(genDiff(filepath1Yaml, filepath2Yaml, 'stylish')).toEqual(exampleStylish);
});

test('compare YAML with plain formatters', () => {
  expect(genDiff(filepath1Yaml, filepath2Yaml, 'plain')).toEqual(examplePlain);
});

test('compare reverse YAML with plain formatters', () => {
  expect(genDiff(filepath2Yaml, filepath1Yaml, 'plain')).toEqual(examplePlainReverse);
});

test('compare YAML with json formatters', () => {
  expect(genDiff(filepath1Yaml, filepath2Yaml, 'json')).toEqual(exampleJSON);
});

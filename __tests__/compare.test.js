import { test, expect } from '@jest/globals';
import * as fs from 'node:fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'node:path';
import genDiff from '../src/index.js';

const file = fileURLToPath(import.meta.url);
const dirName = dirname(file);

const getFixturePath = (filename) => path.join(dirName, '..', '__fixtures__', filename);

const filepath1JSON = getFixturePath('file1.json');
const filepath2JSON = getFixturePath('file2.json');
const filepath1Yaml = getFixturePath('file1.yaml');
const filepath2Yaml = getFixturePath('file2.yml');

const exampleStylish = fs.readFileSync(getFixturePath('exampleStylish.txt'), 'utf8').replaceAll('\r', '');
const examplePlain = fs.readFileSync(getFixturePath('examplePlain.txt'), 'utf8').replaceAll('\r', '');
const exampleJSON = fs.readFileSync(getFixturePath('exampleJSON.txt'), 'utf8').replaceAll('\r', '');

test('compare with default formatters', () => {
  expect(genDiff(filepath1JSON, filepath2JSON)).toEqual(exampleStylish);
  expect(genDiff(filepath1Yaml, filepath2Yaml)).toEqual(exampleStylish);
});

test('compare with stylish formatters', () => {
  expect(genDiff(filepath1JSON, filepath2JSON, 'stylish')).toEqual(exampleStylish);
  expect(genDiff(filepath1Yaml, filepath2Yaml, 'stylish')).toEqual(exampleStylish);
});

test('compare with plain formatters', () => {
  expect(genDiff(filepath1JSON, filepath2JSON, 'plain')).toEqual(examplePlain);
  expect(genDiff(filepath1Yaml, filepath2Yaml, 'plain')).toEqual(examplePlain);
});

test('compare with json formatters', () => {
  expect(genDiff(filepath1JSON, filepath2JSON, 'json')).toEqual(exampleJSON);
  expect(genDiff(filepath1Yaml, filepath2Yaml, 'json')).toEqual(exampleJSON);
});

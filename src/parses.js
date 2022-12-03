import yaml from 'js-yaml';
import * as fs from 'node:fs';
import path from 'node:path';

export default (filePath) => {
  if (filePath.endsWith('.json')) {
    return JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'));
  } if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    return yaml.load(fs.readFileSync(path.resolve(filePath), 'utf8'));
  }
  return 'error';
};

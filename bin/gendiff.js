#!/usr/bin/env node
// import '../src/gendiff.js';

import { program } from 'commander';
import genDiff from '../src/index.js';

program
  .name('gendiff')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1', '-V, --version', 'output the version number')
  .option('-f, --format <type>', 'output format')
  .action((filepath1, filepath2) => {
    const options = program.opts();
    if (options.format === 'plain') {
      console.log(genDiff(filepath1, filepath2, 'plain'));
    } else if (options.format === 'stylish' || options.format === undefined) {
      console.log(genDiff(filepath1, filepath2, 'stylish'));
    } else if (options.format === 'json') {
      console.log(genDiff(filepath1, filepath2, 'json'));
    }
  });

program.parse();

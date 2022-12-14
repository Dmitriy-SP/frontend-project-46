# gendiff

[![Actions Status](https://github.com/Dmitriy-SP/frontend-project-46/workflows/hexlet-check/badge.svg)](https://github.com/Dmitriy-SP/frontend-project-46/actions)
[![CI](https://github.com/Dmitriy-SP/frontend-project-46/actions/workflows/github-action-check.yml/badge.svg)](https://github.com/Dmitriy-SP/frontend-project-46/actions/workflows/github-action-check.yml)
<a href="https://codeclimate.com/github/Dmitriy-SP/frontend-project-46/maintainability"><img src="https://api.codeclimate.com/v1/badges/7a62bf70d6c3b6caf9c8/maintainability" /></a>
<a href="https://codeclimate.com/github/Dmitriy-SP/frontend-project-46/test_coverage"><img src="https://api.codeclimate.com/v1/badges/7a62bf70d6c3b6caf9c8/test_coverage" /></a>

A package that compares two configuration files and shows a difference.

- [Description](#Description)
- [Installation](#Installation)
- [Help](#Help)
- [Examples](#Examples)

## Description

A package that determines the difference between two configuration files and shows a difference.
Supported JSON and YAML file formats.
Уou can use both absolute and relative paths when accessing to files.
Supported output formatters: stylish, plain and json.
If you want to import as a function it looks like:
`genDiff(<filepath1>, <filepath2>, <formatName>)`, and its outcome is the string.
For more information see [examples](#Examples).

## Installation

```
git clone git@github.com:Dmitriy-SP/frontend-project-46.git
make install
npm link
```

## Help
```js
$ gendiff -h
Usage: gendiff [options] <filepath1> <filepath2>
Compares two configuration files and shows a difference.
Options:
  -V, --version        output the version number
  -f, --format <type>  output format
  -h, --help           display help for command
```

## Examples

### Flat JSON file:
<a href="https://asciinema.org/a/hocBI8q6qgavYrsZgDz5kHfzp" target="_blank"><img src="https://asciinema.org/a/hocBI8q6qgavYrsZgDz5kHfzp.svg" /></a>

### Flat YAML file:
<a href="https://asciinema.org/a/fLp21wW4TfMlLHp1wzVxS2Thk" target="_blank"><img src="https://asciinema.org/a/fLp21wW4TfMlLHp1wzVxS2Thk.svg" /></a>

### Nested files:
<a href="https://asciinema.org/a/1WDqsfNNowJFGbn4MpVfvORuO" target="_blank"><img src="https://asciinema.org/a/1WDqsfNNowJFGbn4MpVfvORuO.svg" /></a>

### Available formatters
<a href="https://asciinema.org/a/66mats3kaB2vEeARtUDvpUVqf" target="_blank"><img src="https://asciinema.org/a/66mats3kaB2vEeARtUDvpUVqf.svg" /></a>

### Submitted files:

[file1.json](https://github.com/Dmitriy-SP/frontend-project-46/blob/main/__tests__/__fixtures__/file1.json)
[file2.json](https://github.com/Dmitriy-SP/frontend-project-46/blob/main/__tests__/__fixtures__/file2.json)
[file1.yml](https://github.com/Dmitriy-SP/frontend-project-46/blob/main/__tests__/__fixtures__/file1.yaml)
[file2.yaml](https://github.com/Dmitriy-SP/frontend-project-46/blob/main/__tests__/__fixtures__/file2.yml)

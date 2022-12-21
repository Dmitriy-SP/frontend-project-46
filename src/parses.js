import yaml from 'js-yaml';

export default (data, type) => {
  switch (type) {
    case 'json':
      return JSON.parse(data, 'utf8');
    case 'yaml':
    case 'yml':
      return yaml.load(data, 'utf8');
    default:
      throw new Error('error, nonexistent вфеф format.\nsupported formats: \'json\', \'yaml\'.');
  }
};

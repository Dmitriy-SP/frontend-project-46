import yaml from 'js-yaml';

export default (data, type) => {
  if (type === 'json') {
    return JSON.parse(data, 'utf8');
  }
  return yaml.load(data, 'utf8');
};

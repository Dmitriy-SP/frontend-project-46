import toPlain from './plain.js';
import toStylish from './stylish.js';
import toJson from './json.js';

const chouseFormatters = (diff, formatType) => {
  if (formatType === 'stylish') {
    return toStylish(diff);
  }
  if (formatType === 'plain') {
    return toPlain(diff);
  }
  if (formatType === 'json') {
    return toJson(diff);
  }
  return 'error, nonexistent format.\nsupported formats: \'stylish\', \'plain\'.';
};

export default chouseFormatters;

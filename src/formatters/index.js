import toPlain from './plain.js';
import toStylish from './stylish.js';
import toJson from './json.js';

const format = (diff, formatType) => {
  switch (formatType) {
    case 'stylish':
      return toStylish(diff);
    case 'plain':
      return toPlain(diff);
    case 'json':
      return toJson(diff);
    default:
      throw new Error('error, nonexistent format.\nsupported formats: \'stylish\', \'plain\'.');
  }
};

export default format;

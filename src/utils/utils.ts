import * as fs from 'fs';
import * as path from 'path';

const loadJson = (entity) => {
  try {
    const fixtureFile = `../mocks/${entity}.json`;
    const pathOfFile = path.join(__dirname, fixtureFile);
    if (fs.existsSync(pathOfFile)) {
      return JSON.parse(fs.readFileSync(pathOfFile, 'utf8'));
    }
  } catch (error) {
    throw new Error(
      `ERROR [TestUtils.loadJson()]: Unable to parse JSON file: ${error}`,
    );
  }
};

const writeJsonFromObject = (object, fileName) => {
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };
  const data = JSON.stringify(object, getCircularReplacer());
  fs.writeFileSync(`${fileName}.json`, data, 'utf8');
};

export default {
  writeJsonFromObject,
  loadJson,
};

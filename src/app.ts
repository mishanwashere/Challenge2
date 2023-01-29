import { createReadStream } from 'node:fs';
import * as readline from 'node:readline/promises';

import { LoggingService } from './services/logging.service.js';
import { validateDataForSpecialCharactersAndNumbers, validateDataForAlphabeticalCharactersOnly } from './helpers/validate-strings.js';
import { matchString } from './helpers/match-string.js';

const logging = new LoggingService();

let malePlayers: Set<string> = new Set();
let femalePlayers: Set<string> = new Set();

(async () => {
  try {
    const fileDataStream = await createReadStream('data.csv', { encoding: 'utf8' });
  
    const readLine = readline.createInterface({
      input: fileDataStream, // Read Stream
      output: null // 'null' - No need for Write Stream
    });
  
    for await (const dataEntry of readLine) {
      validateDataEntryForSpecialCharactersAndNumbers(dataEntry);
    }
  } catch (error) {
    console.error("Failed to read data :: " + error);
    logging.log("Fatal", "Failed to read data :: " + error);
  }
})().then(() => {
  matchString(malePlayers, femalePlayers);
});

function splitDataByGender(dataEntry: string): void {
  try {
    if (dataEntry.includes(',f')) {
      let strippedGenderDataEntry: Array<string> = dataEntry.split(','); // remove gender from data set.
      if (!validateDataForAlphabeticalCharactersOnly(strippedGenderDataEntry[0])) {
        throw `Data Entry contains special characters or numbers. :: ${strippedGenderDataEntry[0]}`;
      }

      saveToFemaleDataSet(strippedGenderDataEntry[0]);
      return;
    } 
  
    if (dataEntry.includes(',m')) {
      let strippedGenderDataEntry: Array<string> = dataEntry.split(','); // remove gender from data set.
      if (!validateDataForAlphabeticalCharactersOnly(strippedGenderDataEntry[0])) {
        throw `Data Entry contains special characters or numbers. :: ${strippedGenderDataEntry[0]}`;
      }

      saveToMaleDataSet(strippedGenderDataEntry[0]);
      return;
    }

    throw `No Gender Supplied on data entry :: ${dataEntry}`;
  } catch(error) {
    console.error(error);
    logging.log("Fatal", error);
  }
}

function validateDataEntryForSpecialCharactersAndNumbers(dataEntry: string): void {
  try {
    if (!validateDataForSpecialCharactersAndNumbers(dataEntry)) {
      throw `Data Entry contains special characters or numbers. :: ${dataEntry}`;
    }

    splitDataByGender(dataEntry);
  } catch(error) {
    console.error(error);
    logging.log("Fatal", error);
  }
}

function saveToFemaleDataSet(strippedGenderDataEntry: string): void {
  if (femalePlayers.has(strippedGenderDataEntry)) {
    console.warn(`Duplicate Entry :: ${strippedGenderDataEntry}`);
    logging.log("Warning", `Duplicate Entry :: ${strippedGenderDataEntry}`);
  }

  femalePlayers.add(strippedGenderDataEntry);
}

function saveToMaleDataSet(strippedGenderDataEntry: string): void {
  if (malePlayers.has(strippedGenderDataEntry)) {
    console.warn(`Duplicate Entry :: ${strippedGenderDataEntry}`);
    logging.log("Warning", `Duplicate Entry :: ${strippedGenderDataEntry}`);
  }

  malePlayers.add(strippedGenderDataEntry);
}
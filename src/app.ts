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
    const fileDataStream = await createReadStream('data.csv', { encoding: 'utf8' }); // create read stream.
  
    const readLine = readline.createInterface({
      input: fileDataStream, // Read Stream
      output: null // 'null' - No need for Write Stream
    });
  
    for await (const dataEntry of readLine) { // for every read document line.
      /* 
      * Disclaimer.
      * I validate the data coming from the data.csv file to only contain alphabetical characters and commas (commas since its a csv file).
      * Problem is I have to revalidate the data entry later to ensure the user name doesn't contain a comma (i.e Kimber,ly should pass the first data validation).
      * As a v2 I would rework this data entry read and validation.
      */
      validateDataEntryForSpecialCharactersAndNumbers(dataEntry);
    }
  } catch (error) {
    console.error("Failed to read data :: " + error);
    logging.log("Fatal", "Failed to read data :: " + error);
  }
})().then(() => {
  matchString(malePlayers, femalePlayers); // once data has been read and stored into male and female sets then run 'match-string.ts'
});

function validateDataEntryForSpecialCharactersAndNumbers(dataEntry: string): void { // first validation to be reworked in v2 as mentioned.
  try {
    if (!validateDataForSpecialCharactersAndNumbers(dataEntry)) {
      throw `Data Entry contains special characters or numbers. :: ${dataEntry}`;
    }

    splitDataByGender(dataEntry); // data entry has no special characters then begin splitting of data by gender.
  } catch(error) {
    console.error(error);
    logging.log("Fatal", error);
  }
}

function splitDataByGender(dataEntry: string): void {
  try {
    if (dataEntry.includes(',f')) { // split data entries by female
      let strippedGenderDataEntry: Array<string> = dataEntry.split(','); // remove gender from data set.
      if (!validateDataForAlphabeticalCharactersOnly(strippedGenderDataEntry[0])) { // second validation to be reworked in v2 as mentioned.
        throw `Data Entry contains special characters or numbers. :: ${strippedGenderDataEntry[0]}`;
      }

      saveToFemaleDataSet(strippedGenderDataEntry[0]); // save to female data set.
      return;
    } 
  
    if (dataEntry.includes(',m')) { // split data entries by male
      let strippedGenderDataEntry: Array<string> = dataEntry.split(','); // remove gender from data set.
      if (!validateDataForAlphabeticalCharactersOnly(strippedGenderDataEntry[0])) { // second validation to be reworked in v2 as mentioned.
        throw `Data Entry contains special characters or numbers. :: ${strippedGenderDataEntry[0]}`;
      }

      saveToMaleDataSet(strippedGenderDataEntry[0]); // save to male data set.
      return;
    }

    throw `No Gender Supplied on data entry :: ${dataEntry}`;
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

  femalePlayers.add(strippedGenderDataEntry); // save to femalePlayers data set.
}

function saveToMaleDataSet(strippedGenderDataEntry: string): void {
  if (malePlayers.has(strippedGenderDataEntry)) {
    console.warn(`Duplicate Entry :: ${strippedGenderDataEntry}`);
    logging.log("Warning", `Duplicate Entry :: ${strippedGenderDataEntry}`);
  }

  malePlayers.add(strippedGenderDataEntry); // save to malePlayers data set.
}
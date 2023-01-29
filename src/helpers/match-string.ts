import { LoggingService } from '../services/logging.service.js';
import { writeFile } from 'node:fs/promises';

const logging = new LoggingService();

let storedOutputData: Array<string|number> = [];
let OrderedstoreOutputData: Array<string|number> = [];

export function matchString(dataSet1: Set<string>, dataSet2: Set<string>): void {
    // deep copy to prevent mutations.
    const dataSet1Copy = new Set([...dataSet1]); 
    const dataSet2Copy = new Set([...dataSet2]);

    console.log("Time :: " + new Date().getMilliseconds());
    for (const malePlayer of dataSet1Copy.keys()) {
        for (const femalePlayer of dataSet2Copy.keys()) {
            let stringMatch = `${malePlayer} matches ${femalePlayer}`;
            checkCharacterMatch(stringMatch);
        }
    }
    console.log("Time :: " + new Date().getMilliseconds());
}

function checkCharacterMatch(stringMatch): void {
    let comparisonScoreArray: Array<number> = []
    let removeWhiteSpaceString = stringMatch.replace(/\s+/g, '')
    let comparisonString: Array<string> = removeWhiteSpaceString.split('');
    
    while(comparisonString.length > 0) {
        let removedStringValue = comparisonString.splice(0,1)[0];

        for (let i = 0; i <= comparisonString.length; i++) {
            let comparisonScore: number = 1;
            if (!comparisonString.includes(removedStringValue)) {
                comparisonScoreArray.push(1);
                break;
            }

            while(comparisonString.includes(removedStringValue)) {
                comparisonScore++;
                let index = comparisonString.indexOf(removedStringValue);
                comparisonString.splice(index, 1);
            }

            comparisonScoreArray.push(comparisonScore);
            break;
        }
    }

    reduceComparisonScoreToTwoDigits(stringMatch, comparisonScoreArray);
}

function reduceComparisonScoreToTwoDigits(stringMatch: string, comparisonScoreArray: Array<number>): void {
    if (comparisonScoreArray.length === 2) {
        // print output
        console.log(stringMatch, comparisonScoreArray);
        storeOutputData(stringMatch, comparisonScoreArray);
        comparisonScoreArray = [];
        return;
    }

    let comparisonScoreArrayCopy = [...comparisonScoreArray];
    let tempArray = [];

    while(comparisonScoreArrayCopy.length > 0) {
        if (comparisonScoreArrayCopy.length === 1) {
            tempArray.push(comparisonScoreArrayCopy.pop());
            break;
        }

        let leftValue = comparisonScoreArrayCopy.splice(0,1)[0];
        let rightValue = comparisonScoreArrayCopy.pop();

        let addedValue = leftValue + rightValue;

        if (addedValue >= 10) {
            let thing = addedValue.toString().split('');
            tempArray.push(parseInt(thing[0]));
            tempArray.push(parseInt(thing[1]));
            break;
        }

        tempArray.push(addedValue);
    }

    if (comparisonScoreArrayCopy.length === 1) {
        tempArray.push(comparisonScoreArrayCopy.pop());
    }

    reduceComparisonScoreToTwoDigits(stringMatch, tempArray);
}

function storeOutputData(stringMatch: string, comparisonScoreArray: Array<number>): void {
    let comparisonScoreArrayCopy = [...comparisonScoreArray];
    let tempString = comparisonScoreArrayCopy[0].toString() + comparisonScoreArrayCopy[1].toString();

    // storedOutputData.push(tempString);
    console.log(storedOutputData);
}

async function writeToOutputFile(stringMatch: string, comparisonScoreArray: Array<number>): Promise<void> {
    try {
        await writeFile('output.txt', stringMatch, { flag: 'a' });
    } catch (error) {
        console.error('there was an error:', error.message);
    }
}
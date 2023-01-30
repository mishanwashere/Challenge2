import { LoggingService } from '../services/logging.service.js';
import { writeFile } from 'node:fs/promises';

const logging = new LoggingService();

let storedOutputData: Array<{ value: string, score: number }> = [];
let orderedStoredOutputData: Array<{ value: string, score: number }> = [];

export function matchString(dataSet1: Set<string>, dataSet2: Set<string>): void {
    // deep copy to prevent mutations.
    const dataSet1Copy = new Set([...dataSet1]); 
    const dataSet2Copy = new Set([...dataSet2]);

    // loop over male/female data sets.
    for (const malePlayer of dataSet1Copy.keys()) {
        for (const femalePlayer of dataSet2Copy.keys()) {
            let stringMatch = `${malePlayer} matches ${femalePlayer}`;
            checkCharacterMatch(stringMatch);
        }
    }

    sortDataSet(); // once all data has been read and stored then sort data.
}

function checkCharacterMatch(stringMatch): void {
    let comparisonScoreArray: Array<number> = []
    let removeWhiteSpaceString = stringMatch.replace(/\s+/g, ''); // remove white space.
    let comparisonString: Array<string> = removeWhiteSpaceString.split(''); // split into array.
    
    while(comparisonString.length > 0) {
        let removedStringValue = comparisonString.shift(); // remove first entry.

        for (let i = 0; i <= comparisonString.length; i++) { // check if the first entry has duplicates in the remaining array list of characters. if so then count them.
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

    /* Disclaimer
    * Was getting late in the evening when I was working beyond this point.
    * I would need to reevaluate my implementations below. 
    * Definitely can do abstraction on this file for clarity/brevity/extensibility.
    */

    reduceComparisonScoreToTwoDigits(stringMatch, comparisonScoreArray);
}

/*
* Sum Comparison array values until only 2 digits. 
*/
function reduceComparisonScoreToTwoDigits(stringMatch: string, comparisonScoreArray: Array<number>): void {
    if (comparisonScoreArray.length === 2) { // once we down to 2 digits store and clear comparison array.
        storeOutputData(stringMatch, comparisonScoreArray); // store data.
        comparisonScoreArray = []; // reset array value for next comparison.
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

    reduceComparisonScoreToTwoDigits(stringMatch, tempArray); // recall the function because we have more than 2 digits in array.
}

function storeOutputData(stringMatch: string, comparisonScoreArray: Array<number>): void {
    let comparisonScoreArrayCopy = [...comparisonScoreArray];
    let tempString = comparisonScoreArrayCopy[0].toString() + comparisonScoreArrayCopy[1].toString(); // Since we down to 2 digits this seems acceptable, but not very extensible.

    // create object for sort function.
    let obj: { value: string, score: number } = {
        value: stringMatch,
        score: parseInt(tempString),
    };

    storedOutputData.push(obj); // create array of objects for sort.
}

function sortDataSet(): void {
    // sort via score, followed by alphabetical if scores are identical.
    orderedStoredOutputData = storedOutputData.sort((a,b) => {
        if (b.score === a.score) {
            if(a.value < b.value) { return -1; }
            if(a.value > b.value) { return 1; }
        }

        return b.score - a.score;
    });

    writeToOutputFile(orderedStoredOutputData); // write to file once data has been ordered.
}

async function writeToOutputFile(orderedStoredOutputData: Array<{value: string, score: number}>): Promise<void> {
    try {
        while (orderedStoredOutputData.length > 0) { // keep writing data until orderedStoredOutputData is empty.
            let tempPrintObj = orderedStoredOutputData.shift();

            let outputString: string = '';
            if (tempPrintObj.score > 80) { // if score is greater than 80 append 'good match' string.
                outputString = `${tempPrintObj.value} ${tempPrintObj.score}%, good match\n`;
                await writeFile('output.txt', outputString, { flag: 'a' });
            } else {
                outputString = `${tempPrintObj.value} ${tempPrintObj.score}%\n`;
                await writeFile('output.txt', outputString, { flag: 'a' });
            }
        }
    } catch (error) {
        console.error('there was an error:', error.message);
    }
}
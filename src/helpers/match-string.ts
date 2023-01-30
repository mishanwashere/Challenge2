import { LoggingService } from '../services/logging.service.js';
import { writeFile } from 'node:fs/promises';

const logging = new LoggingService();

let storedOutputData: Array<{ value: string, score: number }> = [];
let OrderedstoreOutputData: Array<{ value: string, score: number }> = [];

export function matchString(dataSet1: Set<string>, dataSet2: Set<string>): void {
    // deep copy to prevent mutations.
    const dataSet1Copy = new Set([...dataSet1]); 
    const dataSet2Copy = new Set([...dataSet2]);

    for (const malePlayer of dataSet1Copy.keys()) {
        for (const femalePlayer of dataSet2Copy.keys()) {
            let stringMatch = `${malePlayer} matches ${femalePlayer}`;
            checkCharacterMatch(stringMatch);
        }
    }

    sortDataSet();
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

    let obj: { value: string, score: number } = {
        value: stringMatch,
        score: parseInt(tempString),
    };

    storedOutputData.push(obj);
}

function sortDataSet(): void {
    OrderedstoreOutputData = storedOutputData.sort((a,b) => {
        if (b.score === a.score) {
            if(a.value < b.value) { return -1; }
            if(a.value > b.value) { return 1; }
        }

        return b.score - a.score;
    });

    writeToOutputFile(OrderedstoreOutputData);
}

async function writeToOutputFile(storedOutputData: Array<{value: string, score: number}>): Promise<void> {
    try {
        while (storedOutputData.length > 0) {
            let tempPrintObj = storedOutputData.shift();

            let outputString: string = '';
            if (tempPrintObj.score > 80) {
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
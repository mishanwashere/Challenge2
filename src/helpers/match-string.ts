import { LoggingService } from '../services/logging.service.js';

const logging = new LoggingService();

let comparisonScoreArray: Array<number> = [];

export function matchString(dataSet1: Set<string>, dataSet2: Set<string>): void {
    // deep copy to prevent mutations.
    const dataSet1Copy = new Set([...dataSet1]); 
    const dataSet2Copy = new Set([...dataSet2]);

    // let thing = dataSet1Copy.values();
    // let thang = dataSet2Copy.values();
    // let stringMatch = `${thing.next().value} matches ${thang.next().value}`;
    // console.log(stringMatch);
    // checkCharacterMatch(stringMatch);

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
    let removeWhiteSpaceString = stringMatch.replace(/\s+/g, '')
    let comparisonString: Array<string> = removeWhiteSpaceString.split('');
    
    while(comparisonString.length > 0) {
        let removedStringValue = comparisonString.splice(0,1)[0];

        for (let i = 0; i <= comparisonString.length; i++) {
            let comparisonScore: number = 1;
            if (!comparisonString.includes(removedStringValue)) {
                pushToComparisonScoreArray(1);
                break;
            }

            while(comparisonString.includes(removedStringValue)) {
                comparisonScore++;
                let index = comparisonString.indexOf(removedStringValue);
                comparisonString.splice(index, 1);
            }

            pushToComparisonScoreArray(comparisonScore);
            break;
        }
    }

    reduceComparisonScoreToTwoDigits(comparisonScoreArray);
}

function pushToComparisonScoreArray(comparisonScore: number): void {
    comparisonScoreArray.push(comparisonScore);
}

function reduceComparisonScoreToTwoDigits(comparisonScoreArray: Array<number>): void {
    if (comparisonScoreArray.length === 2) {
        // print output
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

    reduceComparisonScoreToTwoDigits(tempArray);
}
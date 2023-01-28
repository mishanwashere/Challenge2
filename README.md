## README ##

## Installation

Dependencies:
node@18.13.0

## Usage

1. Add data to the "data.csv" file.
2. Execute program using "npm run ts-node" in CLI.

Problem Statement:

Given the problem statement 'Technical Assessment.pdf' in project.

## Approach:

1. Read from CSV file.
    1.1. Only alphabetic characters
    1.2. Casing shouldn't matter.
2. Group via gender (male/female).
    2.1. No group should contain duplicates (i.e billy m and billy f)
3. Run the string match program against the 2 groups (male/female).
    3.1. Store result. Assuming storing the value is writing to the output.txt.
4. String match >80% should append ', good match'
5. Order from highest match to lowest, if identical match order by alphabetical.
6. Store logs (maybe).

## Technical notes:

1. 
String match program input string:
'${name1} matches ${name2}'

Output string (<80% match):
'${name1} matches ${name2} ${stringMatchPercentage}%'

Output string (>80% match):
'${name1} matches ${name2} ${stringMatchPercentage}%, good match'

2. Test string match program with random character input (Numbers,Symbols,Special Characters).
    2.1 Excluded data to be logged and saved to file (maybe).

3. Save additional performance logs to log file (maybe).

## Architectural notes:

data.csv    --(1)-->  app.js  <--(2)--> stringMatch.js
                        |
                       (3)
                        V
                    output.txt
                    logs.txt (maybe)

1. app.js reads data.csv, and stores in memory.
2. app.js passes data.csv (parsed data) to 'stringMatch.js', 'stringMatch.js' returns string match data to app.js.
3. app.js writes to output.txt and logs.txt (maybe).

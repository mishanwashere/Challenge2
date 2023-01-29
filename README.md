## README ##

# Installation

Dependencies:
node@18.13.0

# Usage

1. Add data to the "data.csv" file.
2. Run "npm install".
3. Execute program using "npm run ts-node-esm" in CLI.

# Problem Statement:

Given the problem statement 'Technical Assessment.pdf' in project.

# Approach:

1. Read from CSV file.  <br />
    1.1. Only alphabetic characters <br />
    1.2. Casing shouldn't matter. <br />
2. Group via gender (male/female). <br />
    2.1. No group should contain duplicates (i.e billy m and billy f)
3. Run the string match program against the 2 groups (male/female).  <br />
    3.1. Store result. Assuming storing the value is writing to the output.txt.
4. String match >80% should append ', good match'
5. Order from highest match to lowest, if identical match order by alphabetical.
6. Store logs (~~maybe~~).

# Technical notes:

1. String match program inputs and outputs:

String match program input string:
'${name1} matches ${name2}'

Output string (<80% match):
'${name1} matches ${name2} ${stringMatchPercentage}%'

Output string (>80% match):
'${name1} matches ${name2} ${stringMatchPercentage}%, good match'

2. Test string match program with random character input (Numbers,Symbols,Special Characters).  <br />
    2.1 Excluded data to be logged and saved to file (~~maybe~~).

3. Save additional performance logs to log file (maybe).

# Architectural notes:

data.csv    --(1)-->  app.ts  <--(2)--> match-string.ts
                        |
                       (3)
                        V
                    output.txt
                    logs.txt (maybe)

1. app.ts reads data.csv, and stores in memory.
2. app.ts passes data.csv (parsed data) to 'match-string.js', 'match-string.js' returns string match data to app.js.
3. app.ts writes to output.txt and logs.txt (~~maybe~~).

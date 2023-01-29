export function validateDataForSpecialCharactersAndNumbers(dataEntry: string): boolean {
    // validate csv data before script begins splitting via gender.
    return /^[a-zA-Z(),]+$/.test(dataEntry);
  }
  
export function validateDataForAlphabeticalCharactersOnly(dataEntry: string): boolean {
    // validate player name for alphabetical characters only, post script splitting data via gender.
    return /^[a-zA-Z()]+$/.test(dataEntry);
}
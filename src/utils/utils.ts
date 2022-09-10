// delimits a string and returns an array
export const stringToArray = (csv: string, delimiter: string) => {
  return csv.split(delimiter).map((item: string) => item.trim());
}

// delimits a comma seperated value and returns an array
export const delimitCSV = (csv: string) => {
  return stringToArray(csv, ',');
}

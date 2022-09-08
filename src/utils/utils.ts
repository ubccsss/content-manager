import {MONTHS_MAP} from "../constants/constants";

// returns a promise that returns a file as a raw binary string when resolved
export const readFile = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (res) => {
      if (res.target) {
        resolve(res.target.result);
      }
    };
    reader.onerror = (err) => reject(err);

    reader.readAsBinaryString(file);
  });
};

// returns current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  return (new Date()).toISOString().split('T')[0];
}

// returns current date in Aug 10, 2001 format
export const getPublishDate = () => {
  const date = new Date();
  return `${MONTHS_MAP[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

// converts date in YYYY-MM-DD format to Aug 10, 2001 format
export const formatDate = (date: string) => {
  const parts = date.split('-');
  return parts ? `${MONTHS_MAP[Number(parts[1])]} ${parts[2]}, ${parts[0]}` : '';
}

// delimits a string and returns an array
export const stringToArray = (csv: string, delimiter: string) => {
  return csv.split(delimiter).map((item: string) => item.trim());
}

// delimits a comma seperated value and returns an array
export const delimitCSV = (csv: string) => {
  return stringToArray(csv, ',');
}

// delimits a comma seperated value and returns an array
export const getLink = (file: File) => {
  return URL.createObjectURL(file);
}

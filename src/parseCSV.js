import Papa from 'papaparse';

export const parseCSV = (csvString) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};
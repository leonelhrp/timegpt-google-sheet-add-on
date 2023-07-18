function validateRangeDataStructure(data) {
  const headerRow = data.find(row => {
    const lowerCaseRow = row.map(cell => {
      if (typeof cell === 'string') {
        return cell.toLowerCase();
      } else {
        return '';
      }
    });
    return lowerCaseRow.includes('timestamp') && lowerCaseRow.includes('value');
  });

  if (!headerRow) {
    throw new Error('Invalid data structure. The headers must include "Timestamp" and "Value".');
  }
}

function validateRangeNotEmpty(data) {
  if (data.flat().every(value => !value)) {
    throw new Error('The selected range is empty. Please select a range with data.');
  }
}

function validateDataTypes(data) {
  for (let i = 1; i < data.length; i++) {
    let row = data[i];
    let timestamp = row[0];
    let value = row[1];

    if (!(timestamp instanceof Date)) {
      throw new Error(`Invalid data type. Expected a date in the 'Timestamp' column, but found "${timestamp}" in row ${i + 1}.`);
    }

    if (typeof value === 'string') {
      value = Number(value);
    }

    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error(`Invalid data type. Expected a number in the 'Value' column, but found "${row[1]}" in row ${i + 1}.`);
    }
  }
}

function getSelectedRange() {
  const range = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveRange();
  let data = range.getValues();

  validateRangeDataStructure(data);
  validateRangeNotEmpty(data)

  const startRow = data.findIndex(row => row[0].toLowerCase() === 'timestamp' && row[1].toLowerCase() === 'value') + 1;
  data = data.slice(startRow);

  validateDataTypes(data)

  return range.getA1Notation();
}

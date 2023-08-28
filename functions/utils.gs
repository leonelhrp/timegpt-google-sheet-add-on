function isDate(value) {
  return value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));
}

function isFinite(value) {
  return Number(value) == value && Number.isFinite(parseFloat(value));
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`
}

const transformedArray = (input) => {
  if (!Array.isArray(input)) {
    return [];
  }
  return input.map((item) => ({
    "timestamp": item[0],
    "value": item[1]
  }));
};


const transformAnomalyResponse = (response) => {
  const outputMap = new Map(response.data.output.map(item => [item.timestamp, item]));

  const result = response.data.input.map(item => {
    return outputMap.get(item.timestamp) || item;
  });

  return result;
}


/**
   * Displays a toast message on screen
   */
function toast(body, title, timeout) {
  return SpreadsheetApp.getActive().toast(
    body,
    title || "TimeGPT Google Sheets",
    timeout || 10 // In seconds
  );
}
function NIXTLA_AUTOML_FORECAST(range, fh) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let data = sheet.getRange(range).getValues();
  const startRow = data.findIndex(row => row[0].toLowerCase() === 'timestamp' && row[1].toLowerCase() === 'value') + 1;

  data = data.slice(startRow);

  const timestamp = data.map(row => row[0]);
  const value = data.map(row => row[1]);

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${TOKEN}`
    },
    payload: JSON.stringify({
      fh: Number(fh),
      timestamp: timestamp,
      value: value
    })
  };

  const response = UrlFetchApp.fetch('http://dashboard.nixtla.io/api/automl_forecast', options);
  const responseData = JSON.parse(response.getContentText());

  const { timestamp: forecastTimestamp, value: forecastValue, lo: forecastLo, hi: forecastHi } = responseData.data;

  const outputData = forecastTimestamp.map((_, i) => [forecastTimestamp[i], forecastValue[i], forecastLo[i], forecastHi[i]]);

  outputData.unshift(['Timestamp', 'Value', 'Lo', 'Hi']);

  return outputData;
}

function NIXTLA_AUTOML_ANOMALY(range, sensibility) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let data = sheet.getRange(range).getValues();
  const startRow = data.findIndex(row => row[0] === 'timestamp' && row[1] === 'value') + 1;

  data = data.slice(startRow);

  const timestamp = data.map(row => row[0]);
  const value = data.map(row => row[1]);

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${TOKEN}`
    },
    payload: JSON.stringify({
      sensibility: Number(sensibility),
      timestamp: timestamp,
      value: value
    })
  };

  const response = UrlFetchApp.fetch('http://dashboard.nixtla.io/api/automl_anomaly', options);
  const responseData = JSON.parse(response.getContentText());

  const { timestamp_insample, lo, hi } = responseData.data;

  const outputData = timestamp_insample.map((_, i) => [timestamp_insample[i], lo[i], hi[i]]);

  outputData.unshift(['Timestamp', 'Lo', 'Hi']);

  return outputData;
}

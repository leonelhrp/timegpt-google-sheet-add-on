const API_BASE_URL = 'https://dashboard.nixtla.io/api';

function getRequestData(range, type) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let data = sheet.getRange(range).getValues();
  const startRow = data.findIndex(row => row[0].toLowerCase() === 'timestamp' && row[1].toLowerCase() === 'value') + 1;

  data = data.slice(startRow);

  console.log('getRequestData: ', JSON.stringify({
    range,
    type,
    data
  }, null, 2));

  const requestData = {
    known: transformedArray(data),
  };

  return requestData;
}

function apiPostRequest(path, requestData) {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${TOKEN}`
    },
    payload: JSON.stringify(requestData),
    muteHttpExceptions: false
  };

  const response = UrlFetchApp.fetch(`${API_BASE_URL}${path}`, options);
  const responseData = JSON.parse(response.getContentText());

  return responseData;
}

function prepareResponseData(responseData) {
  const data = [...responseData.data.input, ...responseData.data.output]
    .map(item => ({ ...item, timestamp: formatDate(item.timestamp) }))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const outputData = data.map(({ timestamp, value, low = 0, high = 0 }) => [timestamp, value, low, high]);
  outputData.unshift(['Timestamp', 'Value', 'Low', 'High']);

  return outputData;
}

function NIXTLA_AUTOML_FORECAST(range, fh) {
  let requestData = getRequestData(range, 'forecast');
  requestData.forecasts = Number(fh);

  console.log('NIXTLA_AUTOML_FORECAST -> requestData: ', JSON.stringify(requestData, null, 2));

  const responseData = apiPostRequest('/automl_forecast', requestData);
  const forecastData = prepareResponseData(responseData);

  return forecastData;
}

function NIXTLA_AUTOML_ANOMALY(range, sensibility) {
  let requestData = getRequestData(range, 'anomaly');
  requestData.sensibility = Number(sensibility);

  console.log('NIXTLA_AUTOML_ANOMALY -> requestData: ', JSON.stringify(requestData, null, 2));

  const responseData = apiPostRequest('/automl_anomaly', requestData);
  const anomalyData = prepareResponseData(responseData);

  return anomalyData;
}

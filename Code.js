const userProperties = PropertiesService.getUserProperties();
let TOKEN = userProperties.getProperty('NIXTLA_TOKEN') || null;

function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('Nixtla')
    .addSubMenu(ui.createMenu('Configuration')
      .addItem('Buy Credits', 'buyCredits')
      .addItem('Set Token', 'promptForToken'))
    .addSubMenu(ui.createMenu('Run Prediction')
      .addItem('Forecast', 'showForecastForm')
      .addItem('Anomaly Detection', 'showAnomalyForm'))
    .addSeparator()
    .addItem('Get Help', 'displayHelp')
    .addToUi();
}

function isDate(value) {
  return value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));
}

function isFinite(value) {
  return Number(value) == value && Number.isFinite(parseFloat(value));
}

function buyCredits() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('BuyCredits')
    .setTitle('Buy Credits')
    .setWidth(300)
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}


function displayHelp() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('Help.html')
    .setTitle('Nixtla Help')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function showAnomalyForm() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('AnomalyForm.html')
    .setTitle('Anomaly Detection Configuration')
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function showForecastForm() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('ForecastForm.html')
    .setTitle('Forecast Configuration')
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function setToken(token) {
  userProperties.setProperty('NIXTLA_TOKEN', token);
  TOKEN = token;
}

function getToken() {
  const maskedToken = TOKEN.length
    ? "*".repeat(20) + TOKEN.slice(-4)
    : null;

  return maskedToken
}


function promptForToken() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('TokenConfig.html')
    .setTitle('Token Configuration')
    .setWidth(400)
    .setHeight(200);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function createAndInsertChart(action, chartType, data) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  const sheets = spreadsheet.getSheets();
  const sheetNames = sheets.map(function (sheet) {
    return sheet.getName();
  });

  const baseName = action + " - " + chartType + " Chart";
  let sheetName = baseName;

  let counter = 1;
  while (sheetNames.includes(sheetName)) {
    counter++;
    sheetName = baseName + " - " + counter;
  }

  const sheet = spreadsheet.insertSheet(sheetName)
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);

  const chartsChartType = Charts.ChartType[chartType] || Charts.ChartType.LINE;

  const chart = sheet.newChart()
    .setChartType(chartsChartType)
    .addRange(sheet.getRange(1, 1, data.length, data[0].length))
    .setPosition(5, 5, 0, 0)
    .setOption('width', 800)
    .setOption('height', 600)
    .build();

  spreadsheet.getActiveSheet().insertChart(chart);
}

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

/**
 * Nixtla Automl Forecast.
 * @return The forecast of selected range.
 * @customfunction
*/
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

/**
 * Nixtla Automl Anomaly.
 * @return The anomaly of selected range.
 * @customfunction
*/
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

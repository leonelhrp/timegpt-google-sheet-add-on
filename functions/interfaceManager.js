function showForecastForm() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('ui/forecastForm')
    .setTitle('Forecast Configuration')
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function showAnomalyForm() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('ui/anomalyForm')
    .setTitle('Anomaly Detection Configuration')
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function buyCredits() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('ui/buyCredits')
    .setTitle('Buy Credits')
    .setWidth(300)
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function displayHelp() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('ui/help')
    .setTitle('Nixtla Help')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function promptForToken() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('ui/tokenConfig')
    .setTitle('Token Configuration')
    .setWidth(400)
    .setHeight(200);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

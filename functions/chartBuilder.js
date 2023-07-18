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

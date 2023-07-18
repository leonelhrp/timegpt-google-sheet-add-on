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

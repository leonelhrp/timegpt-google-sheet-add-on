function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('TimeGPT')
    .addSubMenu(ui.createMenu('Configuration')
      .addItem('Buy Credits', 'buyCredits')
      .addItem('Set Token', 'promptForToken'))
    .addSubMenu(ui.createMenu('Run Forecast')
      .addItem('Future Prediction', 'showFutureForm')
      .addItem('Anomaly Detection', 'showAnomalyForm'))
    .addSeparator()
    .addItem('Get Help', 'displayHelp')
    .addToUi();
}

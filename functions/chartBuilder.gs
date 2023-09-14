function getUniqueSheetName(baseName) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheetName = baseName;
    let counter = 1;

    while (spreadsheet.getSheetByName(sheetName)) {
        counter++;
        sheetName = `${baseName} ${counter}`;
    }

    return sheetName;
}

function createAndInsertChart({ action, data, title, labels }) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const uniqueSheetName = getUniqueSheetName(action);
    const sheet = spreadsheet.insertSheet(uniqueSheetName);

    sheet.getRange(1, 1, data.length, data[0].length).setValues(data);

    const chart = sheet.newChart()
        .setChartType(Charts.ChartType.LINE)
        .addRange(sheet.getRange(1, 1, data.length, data[0].length))
        .setPosition(5, 5, 0, 0)
        .setOption('width', 800)
        .setOption('height', 600)
        .setOption('title', title)
        .setOption('hAxis', {
            title: 'Timestamp',
            format: 'yyyy-MM-dd',
            gridlines: { count: -1, units: { days: { format: ['yyyy-MM-dd'] } } }
        })
        .setOption('vAxis', { title: 'Value' })
        .setOption('series', {
            0: { color: 'blue', label: labels[0] },
            1: { color: 'red', label: labels[1] },
            2: { color: '#E5E5E5', label: labels[2], lineDashStyle: [2, 2], areaOpacity: 0.1 },
            3: { color: '#E5E5E5', label: labels[3], lineDashStyle: [2, 2], areaOpacity: 0.1 }
        })
        .setOption('crosshair', { trigger: 'both' })
        .setOption('interpolateNulls', true)
        .setNumHeaders(1)
        .build();

    spreadsheet.getActiveSheet().insertChart(chart);
}

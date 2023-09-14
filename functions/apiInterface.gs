function getRequestData(range, type = 'forecast', fh, clean_ex_first, finetune_steps, freq = 'D', level) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let data = sheet.getRange(range).getValues();

  const startRow = data.findIndex(row => row[0].toLowerCase() === 'timestamp' && row[1].toLowerCase() === 'value') + 1;
  data = data.slice(startRow);

  const y = {};
  for (let i = 0; i < data.length; i++) {
    const date = new Date(data[i][0]);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    y[formattedDate] = data[i][1];
    if (typeof y[formattedDate] === 'string') {
      y[formattedDate] = Number(y[formattedDate]);
    }
  }

  const requestData = {
    y: y,
    freq: freq
  };

  if (type === 'forecast') {
    requestData.fh = fh || 7;
    requestData.clean_ex_first = clean_ex_first || true;
    requestData.finetune_steps = finetune_steps || 0;
  }

  if (level) {
    requestData.level = level;
  }

  console.log('getRequestData -> requestData: ', JSON.stringify(requestData, null, 2));

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

  console.log('apiPostRequest -> options: ', JSON.stringify(options, null, 2));

  const response = UrlFetchApp.fetch(`${API_BASE_URL}/${path}`, options);
  const responseData = JSON.parse(response.getContentText());

  return responseData;
}

function TIMEGPT_FUTURE(range, fh, clean_ex_first, finetune_steps, freq, level) {
  let levels = [];

  if (level) {
    levels = level.replace(/\s+/g, '').split(',').map(Number);
  }

  const requestData = getRequestData(range, 'forecast', fh, clean_ex_first, finetune_steps, freq, levels);

  console.log('TIMEGPT_FUTURE -> requestData: ', JSON.stringify(requestData, null, 2));

  const responseData = apiPostRequest('timegpt', requestData);

  console.log('TIMEGPT_FUTURE -> responseData: ', JSON.stringify(responseData, null, 2));

  const outputData = [['Timestamp', 'Value']];

  // Vamos a agregar las columnas de intervalos de confianza si existen en la respuesta
  for (let l of levels) {
    if (responseData.data[`lo-${l}`] && responseData.data[`hi-${l}`]) {
      outputData[0].push(`Low ${l}%`, `High ${l}%`);
    }
  }

  for (let i = 0; i < responseData.data.timestamp.length; i++) {
    const row = [
      responseData.data.timestamp[i],
      responseData.data.value[i]
    ];

    for (let l of levels) {
      if (responseData.data[`lo-${l}`] && responseData.data[`hi-${l}`]) {
        row.push(responseData.data[`lo-${l}`][i], responseData.data[`hi-${l}`][i]);
      }
    }

    outputData.push(row);
  }

  console.log('TIMEGPT_FUTURE -> outputData: ', JSON.stringify(outputData, null, 2));

  return outputData;
}


function TIMEGPT_ANOMALY(range, freq, level) {
  if (level) {
    level = level.replace(/\s+/g, '').split(',').map(Number);
  }

  let requestData = getRequestData(range, 'anomaly', null, null, null, freq, level);

  console.log('TIMEGPT_ANOMALY -> requestData: ', JSON.stringify(requestData, null, 2));

  const responseData = apiPostRequest('timegpt_historic', requestData);

  console.log('TIMEGPT_ANOMALY -> responseData: ', JSON.stringify(responseData, null, 2));

  const anomalyData = [['Timestamp', 'Predicted Value', 'Actual Value']];
  for (let i = 0; i < responseData.data.timestamp.length; i++) {
    anomalyData.push([
      responseData.data.timestamp[i],
      responseData.data.value[i],
      responseData.data.y[i]
    ]);
  }

  console.log('TIMEGPT_ANOMALY -> anomalyData: ', JSON.stringify(anomalyData, null, 2));

  return anomalyData;
}

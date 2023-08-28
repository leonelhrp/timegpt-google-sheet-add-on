<p align="center">
  <a href="#">
    <img width="150" height="150" src="https://github.com/leonelhrp/timegpt-forecaster-next/assets/5928864/d8591640-b7f0-4baf-ad0f-383e3f3a7a47" alt="TimeGPT Forecaster">
  </a>
</p>
<p align="center">
  <h1 align="center">TimeGPT Google Sheets Add-On</h1>
  <p align="center">
    Power your predictions with precision using Nixtla's TimeGPT Google Sheets Add-On. The one-stop 🎯 solution for time series forecasting in Google Sheets.
  </p>
</p>

## Features

- **Integrated with Google Sheets**: Seamlessly integrate TimeGPT functions directly into your Google Sheets workspace.
- **Precise Forecasting**: Powered by TimeGPT, one of the state-of-the-art models for time series forecasting.
- **User-Friendly Interface**: Intuitive UI components within Google Sheets for easy access to forecasting and anomaly detection functionalities.
- **Real-Time Predictions**: Get instant forecasting results as you input your data.
- **Data Visualization**: Integrated charting capabilities to visualize your forecasts and detected anomalies.
- **Customizable Parameters**: Adjust forecasting parameters to suit your data's specific needs.

## Built With

- [Google Apps Script](https://developers.google.com/apps-script): Google's scripting language to extend Google Sheets functionalities.
- [Google Sheets API](https://developers.google.com/sheets/api): Provides the ability to read from and write to Google Sheets.
- [Nixtla](https://nixtla.io/): The core forecasting model powering the add-on's predictions.

## Before Start

Before diving into the TimeGPT Google Sheets Add-On, there are a few preliminary steps and requirements:

1. **Google Account**: Ensure you have an active Google account as this add-on is integrated with Google Sheets.
2. **Nixtla API Key**: Obtain a Token/API key from [Nixtla](https://nixtla.io/). This is crucial for accessing and utilizing the forecasting capabilities of the add-on. Usually, this involves signing up on the Nixtla platform and generating an API key.
3. **Data Preparedness**: Ensure that your time series data is organized in two columns: timestamps and values. This is necessary for the add-on to read and process the data accurately.
4. **Permissions**: When using the add-on for the first time, you'll be prompted to grant certain permissions. This is standard procedure to allow the add-on to interact with your Google Sheets data. Rest assured, your data's privacy and security are of utmost importance. No data is stored or shared; it's only used to generate forecasts.
5. **Familiarity with Time Series**: Although the add-on is designed to be user-friendly, a basic understanding of time series data and forecasting can enhance your experience. Familiarize yourself with terms like "forecast horizon," "frequency," and "prediction intervals" to make the most of the tool.

Once you've ticked off these preliminary steps, you're all set to leverage the power of TimeGPT right within your Google Sheets!

## Installation

### (Option 1) From Google Workspace Marketplace

Visit the [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/timegpt-google-sheet-add-on) and install the TimeGPT Google Sheets Add-On.

### (Option 2) Downloading the code

Just [download the latest **TIMEGPT.gs**](https://github.com/leonelhrp/timegpt-forecaster-next/releases/latest/download/TIMEGPT.gs) _all-in-one_ file + [**appsscript.json**](https://github.com/leonelhrp/timegpt-forecaster-next/releases/latest/download/appsscript.json) and **copy & paste** its contents by:

1. With your desired `Google Spreadsheet` opened, go to `Tools -> Script editor`.
    * This will open an editor in a new page with a `Code.gs` file containing an empty function.
    * Remove any content from `Code.gs` and save the project at `File -> Save`. Name it as you like.
2. Go to project properties and ensure the `Show "appsscript.json" manifest file in editor` checkbox is selected.
3. Back in the code editor, select the `Code.gs` file and paste the content from the downloaded `TIMEGPT.gs` file.
4. Repeat the same for `appsscript.json` and optionally set your desired timezone.
5. Save the project again and refresh your Google Spreadsheet (press `F5` on the browser).
    * Once reloaded, you should see a small notification at the bottom-right corner.
6. Go to the `TimeGPT` menu on your spreadsheet's main toolbar and click on the `Authorize add-on!` item.
7. A Google dialog should appear for permissions. Go through the steps and click `Allow`.
    * The popup will close, and you might not see immediate changes on your spreadsheet.
8. After the add-on is authorized, repeat step `6` (click `Authorize add-on!` again), and you're set!

### (Option 3) For Developers 🚀

To integrate the TimeGPT Google Sheets Add-On into your Google Spreadsheets locally, you'll require [node](https://nodejs.org) and [clasp](https://github.com/google/clasp).

1. Install `node` and then `clasp` globally: `npm install -g @google/clasp`.
2. Clone the repository: `git clone https://github.com/leonelhrp/timegpt-forecaster-next.git`.
3. Authenticate with Google: `clasp login`.
4. To set the project ID for the Google Spreadsheet you want to work with:
    1. With your `Google Spreadsheet` open, navigate to `Tools -> Script editor`.
    2. In the `Google Script` interface, go to `File -> Project properties`.
    3. Note down the value under the `Script ID` label.
    4. Ensure the `Show "appsscript.json" manifest file in editor` checkbox is selected.
5. In your terminal, navigate to the project directory and link the script with the command: `clasp clone YOUR_SCRIPT_ID`, replacing `YOUR_SCRIPT_ID` with the ID from the previous step.
6. Push the local code to your Google Spreadsheet using `clasp push`.
7. Refresh your Google Spreadsheet (press `F5`).
    * You should notice a notification at the bottom-right corner after reloading.
8. Navigate to the `TimeGPT` menu on your spreadsheet's toolbar and select the `Authorize add-on!` option.
9. A Google dialog will request permissions. Go through the steps and click `Allow`.
10. After authorizing, select `Authorize add-on!` again from the `TimeGPT` menu, and you're ready to go!

## Using TimeGPT Functions

### Future Prediction

Use this function to create a future prediction based on your data. The syntax is:
```
=TIMEGPT_FUTURE(range, fh, clean_ex_first, finetune_steps, freq, level)
```

Where:
- `range` is a range of cells containing timestamp and value data (two columns).
- `fh` is a number representing the forecast steps.
- `clean_ex_first` (optional) is a boolean indicating whether to clean exogenous variables before training. Default is true.
- `finetune_steps` (optional) is a number of finetuning steps. Default is 0.
- `freq` is the frequency of data (e.g., 'D' for daily).
- `level` (optional) is a list of values representing the prediction intervals. E.g., [80, 90].

### Anomaly Detection

Use this function to predict time series data for the in-sample period (historical period). The syntax is:
```
=TIMEGPT_ANOMALY(range, freq, level)
```

Where:
- `range` is a range of cells containing timestamp and value data (two columns).
- `freq` is the frequency of data (e.g., 'D' for daily).
- `level` (optional) is a list of values representing the prediction intervals. E.g., [80, 90].

## Generate Forecast and Anomaly Detection Graphs

### Forecast

To use "Forecast Form", navigate to the "Run Forecast" submenu and click on "Future Prediction". A sidebar will appear.

Fill in the necessary details:
- "Range" - input the range of cells containing timestamp and value data.
- "Forecast steps" - input the number of forecast steps you want.
- "Frequency" - input the frequency of your data.
- "Prediction Intervals" - input the levels for your prediction intervals (e.g., 80, 90).

Click "Submit" to run the forecast.

### Anomaly Detection

To use "Anomaly Detection Form", navigate to the "Run Forecast" submenu and click on "Anomaly Detection". A sidebar will appear.

Fill in the necessary details:
- "Range" - input the range of cells containing timestamp and value data.
- "Frequency" - input the frequency of your data.
- "Prediction Intervals" - input the levels for your prediction intervals (e.g., 80, 90).

Click "Submit" to run the anomaly detection.

## Contributing

We welcome contributions from the community. Whether it's a bug fix, new feature, or a simple correction, your help is appreciated!

1. **Fork** the repository on GitHub.
2. **Clone** your fork.
3. Create a new **branch** for your changes.
4. **Commit** your changes in the branch.
5. **Push** the branch to your fork on GitHub.
6. Open a **Pull Request** from your fork to the main repository.

## License

This project is open source and available under the [MIT License](LICENSE).

<p align="center">
Made with ❤️ by Leonel 🇻🇪 and Nixtla 🇲🇽
</p>

// ==UserScript==
// @name         worldometer covid table
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the numbers in tabular format
// @author       Josh Parker
// @match        https://www.worldometers.info/coronavirus/usa/*
// @match        https://www.worldometers.info/coronavirus/country/*
// @icon         https://www.google.com/s2/favicons?domain=worldometers.info
// @grant        GM_download
// ==/UserScript==

(function worldometerCovidTable() {
  const getChartOptions = function getChartOptions(html) {
    const chartOptions = [];
    let chartPosition = html.indexOf('Highcharts.chart');
    while (chartPosition !== -1) {
      chartOptions.push(chartPosition);
      chartPosition = html.indexOf('Highcharts.chart', chartPosition + 1);
    }

    return chartOptions.map((pos) => {
      const sliceStart = html.indexOf('{', pos);
      for (let i = sliceStart + 1, bracketCount = 1; i < html.length; i++) {
        if (html[i] === '{') bracketCount += 1;
        else if (html[i] === '}') bracketCount -= 1;
        if (bracketCount === 0) return html.slice(sliceStart, i + 1);
      }

      throw new Error('unmatched bracket');
    });
  };

  fetch(document.URL)
    .then((r) => r.text())
    .then((t) => getChartOptions(t))
    .then((chartOptions) => {
      const xaxisCategoriesPos = chartOptions[0].indexOf('categories');
      const datesString = chartOptions[0].slice(chartOptions[0].indexOf('[', xaxisCategoriesPos), 1 + chartOptions[0].indexOf(']', xaxisCategoriesPos));
      const dates = JSON.parse(datesString);
      const dataColumns = [];
      chartOptions.forEach((chartOption) => {
        const seriesPos = chartOption.indexOf('series: [');
        const dataSeries = chartOption.slice(seriesPos).match(/name:[^\]]*\]/gs);
        dataSeries.forEach((series) => {
          const { name } = series.match(/name: '(?<name>[^']*)'/).groups;
          const prevColumn = dataColumns[dataColumns.length - 1];
          if (!prevColumn || name !== prevColumn.name) {
            const { dataString } = series.match(/data: (?<dataString>\[[^\]]*\])/).groups;
            const data = JSON.parse(dataString);
            dataColumns.push({ name, data });
          }
        });
      });

      const table = document.createElement('table');
      table.id = 'covid-table';

      const dataHeading = dataColumns.map(({ name }) => `<th>${name}</th>`).join('');
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const bodyRows = dates.map((date, i) => `<tr title="${days[(new Date(date)).getDay()]}"><td>${date}</td>${dataColumns.map(({ data }) => `<td>${data[i]}</td>`).join('')}</tr>`).join('');
      table.innerHTML = `<thead><tr><th>dates</th>${dataHeading}</tr></thead><tbody>${bodyRows}</tbody>`;

      document.querySelector('body').appendChild(table);
      document.styleSheets[0].insertRule('#covid-table { margin: 2rem 6rem; border: solid black; font-size: small; }');
      document.styleSheets[0].insertRule('#covid-table th, #covid-table td { border: solid 0.2px darkgray; }');
      document.styleSheets[0].insertRule('#covid-table th { position: sticky; top: -1px; background: lightblue; padding: 0.4rem 1rem; }');
      document.styleSheets[0].insertRule('#covid-table td { padding: 0.3rem 1.5rem; text-align: right; }');
      document.styleSheets[0].insertRule('#covid-table tr[title=sunday] { background-color: hsl(300, 100%, 85%); }');
      document.styleSheets[0].insertRule('#covid-table tr[title=monday] { background-color: hsl(280, 100%, 87%); }');
      document.styleSheets[0].insertRule('#covid-table tr[title=tuesday] { background-color: hsl(260, 100%, 89%); }');
      document.styleSheets[0].insertRule('#covid-table tr[title=wednesday] { background-color: hsl(240, 100%, 91%); }');
      document.styleSheets[0].insertRule('#covid-table tr[title=thursday] { background-color: hsl(220, 100%, 93%); }');
      document.styleSheets[0].insertRule('#covid-table tr[title=friday] { background-color: hsl(200, 100%, 95%); }');
      document.styleSheets[0].insertRule('#covid-table tr[title=saturday] { background-color: hsl(180, 100%, 97%); }');

      const saveButton = document.createElement('button');
      saveButton.innerText = 'Save table as CSV';

      saveButton.addEventListener('click', () => {
        const csv = `dates,${dataColumns.map(({ name }) => name).join(',')}\n${dates.map((date, i) => `"${date}",${dataColumns.map(({ data }) => data[i]).join(',')}`).join('\n')}`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        GM_download({
          url,
          name: `covid-table-${document.title.split('COVID')[0].trim()}.csv`,
          saveAs: true,
          onerror: ({ error, details }) => {
            console.log(error);
            console.log(details);
            if (error === 'not_whitelisted') {
              const alert = document.createElement('div');
              alert.innerText = 'You have to have .csv in your whitelisted extensions. Go to tampermonkey settings and make sure settings mode is beginner or advanced, not novice. Look for Downloads BETA.';
              alert.style.setProperty('color', 'red');
              alert.style.setProperty('position', 'absolute');
              saveButton.appendChild(alert);
            }
          },
        });
      });

      document.querySelector('body').appendChild(saveButton);
    });
}());

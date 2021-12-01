// ==UserScript==
// @name         up and coming pages in wikipedia category
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  movers from the past three years chart to the past three months chart
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/Category:*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function upAndComingUserScript() {
  const movementButton = document.createElement('button');
  movementButton.innerText = 'get chart movement';

  const apiUrl = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/';

  const yyyymmdd = function yyyymmdd(date) {
    const isoString = date.toISOString();
    const isoMatch = isoString.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T\d\d:\d\d:\d\d.\d{3}Z/);
    const { year, month, day } = isoMatch.groups;
    return `${year}${month}${day}`;
  };

  const addMonths = function addMonths(date, months) {
    const calculatedDate = new Date(date);
    calculatedDate.setMonth(date.getMonth() + months);
    return calculatedDate;
  };

  const now = new Date();
  const today = yyyymmdd(now);
  const threeMonths = yyyymmdd(addMonths(now, -3));
  const threeYears = yyyymmdd(addMonths(now, -36));

  const getPageViewUrls = (categoryLinks) => [...categoryLinks].map((a) => `${apiUrl}${a.href.match(/wiki\/(.*)$/)[1].replaceAll('/', '%2F')}/monthly/`).map((urlPrefix) => ({ months: `${urlPrefix}${threeMonths}/${today}`, years: `${urlPrefix}${threeYears}/${today}` }));

  const fetchUrls = function fetchUrls(urls, name) {
    return urls.map((url) => fetch(url[name]).then((r) => r.json()).then((json) => {
      if (json.items) {
        return json.items.reduce((sum, item) => sum + item.views, 0);
      }

      return json.title;
    }));
  };

  const setViewAttribute = function setViewAttribute(categoryLinks, i, name) {
    return (views, index) => {
      if (typeof views === 'number') {
        categoryLinks[index + i].setAttribute(name, views);
      }
    };
  };

  const REQUESTS_PER_SECOND = 100;
  const timeouts = [];
  const getPageViews = function getPageViews() {
    movementButton.setAttribute('disabled', true);

    const categoryLinks = document.querySelectorAll('#mw-pages li > a');

    movementButton.innerText = `getting movement (${Math.ceil(categoryLinks.length / REQUESTS_PER_SECOND)} seconds)`;

    const pageViewUrls = getPageViewUrls(categoryLinks);
    for (let i = 0; i < pageViewUrls.length; i += Math.floor(REQUESTS_PER_SECOND / 2)) {
      const pageViewUrlsSlice = pageViewUrls.slice(i, i + Math.floor(REQUESTS_PER_SECOND / 2));
      const timeoutDelayInMilliseconds = (i * 1000) / REQUESTS_PER_SECOND;
      timeouts.push(() => (
        new Promise((resolve) => {
          setTimeout(() => {
            const results = {};
            Promise.all(fetchUrls(pageViewUrlsSlice, 'months'))
              .then((monthResults) => {
                results.months = monthResults;
                results.months.forEach(setViewAttribute(categoryLinks, i, 'views-months'));
                if (results.years) {
                  resolve(results);
                }
              });
            Promise.all(fetchUrls(pageViewUrlsSlice, 'years'))
              .then((yearResults) => {
                results.years = yearResults;
                results.years.forEach(setViewAttribute(categoryLinks, i, 'views-years'));
                if (results.months) {
                  resolve(results);
                }
              });
          }, timeoutDelayInMilliseconds);
        })
      ));
    }

    Promise.all(timeouts.map((timeout) => timeout()))
      .then(() => {
        const catLinks = [...document.querySelectorAll('#mw-pages li > a')];
        catLinks.sort((a, b) => b.getAttribute('views-months') - a.getAttribute('views-months'));
        catLinks.forEach((link, i) => link.setAttribute('rank-months', i));
        catLinks.sort((a, b) => b.getAttribute('views-years') - a.getAttribute('views-years'));
        catLinks.forEach((link, i) => link.setAttribute('rank-years', i));
        catLinks.forEach((link) => { const a = link; a.innerText += ` (movement: ${a.getAttribute('rank-years') - a.getAttribute('rank-months')})`; });
        movementButton.innerText = 'done';
      });
  };

  movementButton.addEventListener('click', getPageViews);
  document.querySelector('#mw-pages > h2').appendChild(movementButton);
}());

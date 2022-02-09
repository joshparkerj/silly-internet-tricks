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
  const sortButton = document.createElement('button');
  sortButton.innerText = 'sort by movement';
  const movementButton = document.createElement('button');
  movementButton.innerText = 'get chart movement';

  const apiRoot = 'https://wikimedia.org/';
  const apiPath = 'api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/';
  const apiUrl = `${apiRoot}${apiPath}`;

  const yyyymmdd = function yyyymmdd(date) {
    const isoString = date.toISOString();
    const isoRe = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T\d\d:\d\d:\d\d.\d{3}Z/;
    const isoMatch = isoString.match(isoRe);
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

  const mapTitles = (a) => {
    const title = a.href.match(/wiki\/(.*)$/)[1].replaceAll('/', '%2F');
    return `${apiUrl}${title}/monthly/`;
  };

  const mapMonthsYears = (urlPrefix) => (
    {
      months: `${urlPrefix}${threeMonths}/${today}`,
      years: `${urlPrefix}${threeYears}/${today}`,
    });

  const getPageViewUrls = (categoryLinks) => [...categoryLinks].map(mapTitles).map(mapMonthsYears);

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

    const remainingSeconds = Math.ceil(categoryLinks.length / REQUESTS_PER_SECOND);
    movementButton.innerText = `getting movement (${remainingSeconds} seconds)`;
    // const updateRemainingSeconds = function updateRemainingSeconds() {
    //   const innerTextRe = /getting movement \((?<remainingSeconds>-?\d+(\.\d+)?) seconds\)/;
    //   const innerTextMatch = movementButton.innerText.match(innerTextRe);
    //   const { remainingSecondsText } = innerTextMatch.groups;
    //   const remainingSecondsNow = Number(remainingSecondsText) - 0.5;
    //   movementButton.innerText = `getting movement (${remainingSecondsNow} seconds)`;
    // };

    const pageViewUrls = getPageViewUrls(categoryLinks);
    for (let i = 0; i < pageViewUrls.length; i++) {
      const pageViewUrlsSlice = pageViewUrls.slice(i, i + 1);
      const timeoutDelayInMilliseconds = (2 * (i * 1000)) / REQUESTS_PER_SECOND;
      timeouts.push(() => (
        new Promise((resolve) => {
          setTimeout(() => {
            const results = {};
            Promise.all(fetchUrls(pageViewUrlsSlice, 'months'))
              .then((monthResults) => {
                results.months = monthResults;
                results.months.forEach(setViewAttribute(categoryLinks, i, 'views-months'));
                if (results.years) {
                  // updateRemainingSeconds();
                  resolve(results);
                }
              });
            Promise.all(fetchUrls(pageViewUrlsSlice, 'years'))
              .then((yearResults) => {
                results.years = yearResults;
                results.years.forEach(setViewAttribute(categoryLinks, i, 'views-years'));
                if (results.months) {
                  // updateRemainingSeconds();
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
        catLinks.forEach((link) => {
          const rankYears = link.getAttribute('rank-years');
          const rankMonths = link.getAttribute('rank-months');
          link.appendChild(new Text(` (movement: ${rankYears - rankMonths})`));
        });
        document.querySelector('#mw-pages > h2').appendChild(sortButton);
        movementButton.innerText = 'done';
      });
  };

  const sortByMovement = function sortByMovement() {
    const categoryLinks = document.querySelectorAll('#mw-pages li > a');
    const linkSorter = (ab) => {
      const viewMatch = ab.innerText.match(/\(movement: (-?\d+)\)/);
      if (viewMatch) {
        return +(viewMatch[1]);
      }

      return -1;
    };

    const sortedLinks = [...categoryLinks].sort((a, b) => linkSorter(b) - linkSorter(a));
    const mwCategory = document.querySelector('#mw-pages .mw-category');
    const mwContentLtr = document.querySelector('#mw-pages .mw-content-ltr');
    const categorySection = mwCategory || mwContentLtr;
    const allCategorySections = document.querySelectorAll('#mw-pages .mw-category');
    const unsorted = [...allCategorySections].map((section) => section.innerHTML);
    categorySection.innerHTML = '';
    const undoSort = function undoSort() {
      document.styleSheets[0].deleteRule(0);
      document.styleSheets[0].deleteRule(0);
      allCategorySections.forEach((section, i) => {
        const s = section;
        s.innerHTML = unsorted[i];
      });
      sortButton.removeEventListener('click', undoSort);
      sortButton.addEventListener('click', sortByMovement);
    };

    document.styleSheets[0].insertRule('#mw-pages .mw-category a { display: block; }');
    document.styleSheets[0].insertRule('#mw-pages .mw-category ~ .mw-category { display: none; }');
    sortedLinks.forEach((link) => categorySection.appendChild(link));
    sortButton.removeEventListener('click', sortByMovement);
    sortButton.addEventListener('click', undoSort);
    sortButton.innerText = 'undo sort';
  };

  sortButton.addEventListener('click', sortByMovement);

  movementButton.addEventListener('click', getPageViews);
  let mwPagesH2 = document.querySelector('#mw-pages > h2');
  if (!mwPagesH2) {
    let mwPages = document.querySelector('#mw-pages');
    if (!mwPages) {
      mwPages = document.createElement('div');
      mwPages.id = 'mw-pages';
      document.querySelector('div#mw-content-text').after(mwPages);
    }

    mwPagesH2 = document.createElement('h2');
    mwPages.appendChild(mwPagesH2);
  }

  mwPagesH2.appendChild(movementButton);
}());

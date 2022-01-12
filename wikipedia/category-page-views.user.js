// ==UserScript==
// @name         get page views this month for each page in the category
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/Category:*
// @match        https://en.wikipedia.org/w/index.php?title=Category:*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function wikCategoryPageViewsUserScript() {
  let period = 'week';
  const sortByPageViewsButton = document.createElement('button');
  const sortButtonInnerText = () => `sort by page views from the past ${period}`;
  sortByPageViewsButton.innerText = sortButtonInnerText();

  const getPageViewsButton = document.createElement('button');
  const getButtonInnerText = () => `get page views from the past ${period}`;
  getPageViewsButton.innerText = getButtonInnerText();

  const periodSelect = document.createElement('select');

  // the api is documented at https://wikimedia.org/api/rest_v1/#/Pageviews%20data/get_metrics_pageviews_per_article__project___access___agent___article___granularity___start___end_
  // IMPORTANT: The rate limit is 100 requests per second.
  const apiUrl = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/';

  const yyyymmdd = function yyyymmdd(date) {
    const isoString = date.toISOString();
    const isoMatch = isoString.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T\d\d:\d\d:\d\d.\d{3}Z/);
    const { year, month, day } = isoMatch.groups;
    return `${year}${month}${day}`;
  };

  const addDays = function addDays(date, days) {
    const calculatedDate = new Date(date);
    calculatedDate.setDate(date.getDate() + days);
    return calculatedDate;
  };

  const addMonths = function addMonths(date, months) {
    const calculatedDate = new Date(date);
    calculatedDate.setMonth(date.getMonth() + months);
    return calculatedDate;
  };

  const thisDate = new Date();

  const today = yyyymmdd(thisDate);

  const startDates = {
    week: { startDate: yyyymmdd(addDays(thisDate, -7)), granularity: 'daily' },
    month: { startDate: yyyymmdd(addMonths(thisDate, -1)), granularity: 'monthly' },
    'three months': { startDate: yyyymmdd(addMonths(thisDate, -3)), granularity: 'monthly' },
    year: { startDate: yyyymmdd(addMonths(thisDate, -12)), granularity: 'monthly' },
    'three years': { startDate: yyyymmdd(addMonths(thisDate, -36)), granularity: 'monthly' },
  };

  const getPageViewUrls = (categoryLinks, startDate, granularity) => [...categoryLinks].map((a) => {
    const titleHref = a.href.match(/wiki\/(.*)$/)[1].replaceAll('/', '%2F').replace(/^Talk:/, '');
    return `${apiUrl}${titleHref}/${granularity}/${startDate}/${today}`;
  });

  const REQUESTS_PER_SECOND = 100;
  const getPageViews = function getPageViews(timePeriod) {
    getPageViewsButton.setAttribute('disabled', true);
    periodSelect.setAttribute('disabled', true);
    const categoryLinks = document.querySelectorAll('#mw-pages li > a');

    const { startDate, granularity } = startDates[timePeriod];
    const pageViewUrls = getPageViewUrls(categoryLinks, startDate, granularity);
    for (let i = 0; i < pageViewUrls.length; i += REQUESTS_PER_SECOND) {
      const pageViewUrlsSlice = pageViewUrls.slice(i, i + REQUESTS_PER_SECOND);
      const timeoutDelayInMilliseconds = (i * 1000) / REQUESTS_PER_SECOND;
      setTimeout(() => {
        Promise.all(pageViewUrlsSlice.map((url) => fetch(url).then((r) => r.json()).then((json) => {
          if (json.items) {
            return json.items.reduce((sum, item) => sum + item.views, 0);
          }
          return json.title;
        })))
          .then((results) => {
            document.querySelector('#mw-pages > h2').appendChild(sortByPageViewsButton);
            results.forEach((views, index) => {
              if (typeof views === 'number') {
                categoryLinks[index + i].innerText += ` (${views} page views in the past ${timePeriod})`;
              } else {
                categoryLinks[index + i].innerText += ` (page views ${views})`;
              }
            });
          });
      }, timeoutDelayInMilliseconds);
    }
  };

  getPageViewsButton.addEventListener('click', () => getPageViews(period));

  const sortByPageViews = function sortByPageViews() {
    const categoryLinks = document.querySelectorAll('#mw-pages li > a');
    const linkSorter = (ab) => {
      const viewMatch = ab.innerText.match(/\((\d+) page views in the past .{4,12}\)/);
      if (viewMatch) {
        return +(viewMatch[1]);
      }
      return -1;
    };

    const sortedLinks = [...categoryLinks].sort((a, b) => linkSorter(b) - linkSorter(a));
    const categorySection = document.querySelector('#mw-pages .mw-category') || document.querySelector('#mw-pages .mw-content-ltr');
    const allCategorySections = document.querySelectorAll('#mw-pages .mw-category');
    const unsorted = [...allCategorySections].map((section) => section.innerHTML);
    categorySection.innerHTML = '';
    const undoSort = function undoSort() {
      document.styleSheets[0].deleteRule(0);
      document.styleSheets[0].deleteRule(0);
      allCategorySections.forEach((section, i) => {
        const s = section; s.innerHTML = unsorted[i];
      });

      sortByPageViewsButton.removeEventListener('click', undoSort);
      sortByPageViewsButton.addEventListener('click', sortByPageViews);
      sortByPageViewsButton.innerText = sortButtonInnerText();
    };

    document.styleSheets[0].insertRule('#mw-pages .mw-category a { display: block; }');
    document.styleSheets[0].insertRule('#mw-pages .mw-category ~ .mw-category { display: none; }');
    sortedLinks.forEach((link) => categorySection.appendChild(link));
    sortByPageViewsButton.removeEventListener('click', sortByPageViews);
    sortByPageViewsButton.addEventListener('click', undoSort);
    sortByPageViewsButton.innerText = 'undo sort';
  };

  sortByPageViewsButton.addEventListener('click', sortByPageViews);

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

  mwPagesH2.appendChild(getPageViewsButton);

  Object.keys(startDates).forEach((periodValue) => {
    const periodOption = document.createElement('option');
    periodOption.innerText = periodValue;
    periodOption.value = periodValue;
    periodSelect.appendChild(periodOption);
  });

  periodSelect.querySelector('option').setAttribute('selected', true);
  periodSelect.addEventListener('change', ({ target }) => {
    period = target.value;
    sortByPageViewsButton.innerText = sortButtonInnerText();
    getPageViewsButton.innerText = getButtonInnerText();
  });

  document.querySelector('#mw-pages > h2').appendChild(periodSelect);
  // document.styleSheets[0].addRule('#mw-pages .mw-content-ltr', 'column-count: 3');
}());

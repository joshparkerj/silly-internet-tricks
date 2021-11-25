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

(function () {
  'use strict';

  const sortByPageViewsThisMonthButton = document.createElement('button');
  sortByPageViewsThisMonthButton.innerText = 'sort by page views this month';

  const getPageViewsThisMonthButton = document.createElement('button');
  getPageViewsThisMonthButton.innerText = 'get page views this month';

  const getPageViewsThisMonth = function getPageViewsThisMonth() {
    getPageViewsThisMonthButton.setAttribute('disabled', true);
    const categoryLinks = document.querySelectorAll('#mw-pages li > a');

    // the api is documented at https://wikimedia.org/api/rest_v1/#/Pageviews%20data/get_metrics_pageviews_per_article__project___access___agent___article___granularity___start___end_
    // IMPORTANT: The rate limit is 100 requests per second.
    const apiUrl = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/';
    const thisDate = new Date();
    const thisYear = thisDate.getFullYear();
    const thisMonth = thisDate.getMonth() + 1;
    const thisDay = thisDate.getDate();

    const today = `${thisYear}${thisMonth.toString().padStart(2, '0')}${thisDay.toString().padStart(2, '0')}`;

    const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;

    const lastMonthDate = `${thisYear}${lastMonth.toString().padStart(2, '0')}01`;

    const pageViewUrls = [...categoryLinks].map(a => `${apiUrl}${a.href.match(/wiki\/(.*)$/)[1].replaceAll('/', '%2F')}/monthly/${lastMonthDate}/${today}`);

    const REQUESTS_PER_SECOND = 100;

    for (let i = 0; i < pageViewUrls.length; i += REQUESTS_PER_SECOND) {
      const pageViewUrlsSlice = pageViewUrls.slice(i, i + REQUESTS_PER_SECOND);
      const timeoutDelayInMilliseconds = i * 1000 / REQUESTS_PER_SECOND;
      console.log(timeoutDelayInMilliseconds);
      setTimeout(() => {
        Promise.all(pageViewUrlsSlice.map(url => fetch(url).then(r => r.json()).then(json => {
          if (json.items) {
            return json.items[0].views;
          } else {
            return json.title;
          }
        })))
          .then(results => {
            document.querySelector('#mw-pages > h2').appendChild(sortByPageViewsThisMonthButton);
            results.forEach((views, index) => {
              if (typeof views === 'number') {
                categoryLinks[index + i].innerText += ` (${views} page views this month)`;
              } else {
                categoryLinks[index + i].innerText += ` (page views ${views})`;
              }
            });
          })
      }, timeoutDelayInMilliseconds);
    }


  };

  getPageViewsThisMonthButton.addEventListener('click', getPageViewsThisMonth);

  const sortByPageViewsThisMonth = function sortByPageViewsThisMonth() {
    const categoryLinks = document.querySelectorAll('#mw-pages li > a');
    const linkSorter = ab => {
      const viewMatch = ab.innerText.match(/\((\d+) page views this month\)/);
      if (viewMatch) {
        return +(viewMatch[1]);
      } else {
        return -1;
      }
    };

    const sortedLinks = [...categoryLinks].sort((a, b) => linkSorter(b) - linkSorter(a));
    const categorySection = document.querySelector('#mw-pages .mw-category');
    const allCategorySections = document.querySelectorAll('#mw-pages .mw-category');
    const unsorted = [...allCategorySections].map(section => section.innerHTML);
    categorySection.innerHTML = '';
    const undoSort = function undoSort() {
      document.styleSheets[0].deleteRule(0);
      document.styleSheets[0].deleteRule(0);
      allCategorySections.forEach((section, i) => { section.innerHTML = unsorted[i] });
      sortByPageViewsThisMonthButton.removeEventListener('click', undoSort);
      sortByPageViewsThisMonthButton.addEventListener('click', sortByPageViewsThisMonth);
      sortByPageViewsThisMonthButton.innerText = 'sort by page views this month';
    };

    document.styleSheets[0].insertRule('#mw-pages .mw-category a { display: block; }');
    document.styleSheets[0].insertRule('#mw-pages .mw-category ~ .mw-category { display: none; }');
    sortedLinks.forEach(link => categorySection.appendChild(link));
    sortByPageViewsThisMonthButton.removeEventListener('click', sortByPageViewsThisMonth);
    sortByPageViewsThisMonthButton.addEventListener('click', undoSort);
    sortByPageViewsThisMonthButton.innerText = 'undo sort';
  };

  sortByPageViewsThisMonthButton.addEventListener('click', sortByPageViewsThisMonth);

  document.querySelector('#mw-pages > h2').appendChild(getPageViewsThisMonthButton);
})();

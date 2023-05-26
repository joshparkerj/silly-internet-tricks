import yyyymmdd from './yyyymmdd';

export default function getChartMovement(movementButton, sortButton, apiUrl) {
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

 const mapMonthsYears = (urlPrefix) => ({
  months: `${urlPrefix}${threeMonths}/${today}`,
  years: `${urlPrefix}${threeYears}/${today}`,
 });

 const getPageViewUrls = (categoryLinks) => [...categoryLinks].map(mapTitles).map(mapMonthsYears);

 const fetchUrls = function fetchUrls(urls, name) {
  return urls.map((url) => fetch(url[name])
   .then((r) => r.json())
   .then((json) => {
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

 movementButton.setAttribute('disabled', true);

 const categoryLinks = document.querySelectorAll('#mw-pages li > a');

 const remainingSeconds = Math.ceil(categoryLinks.length / REQUESTS_PER_SECOND);
 movementButton.replaceChildren(new Text(`getting movement (${remainingSeconds} seconds)`));

 const pageViewUrls = getPageViewUrls(categoryLinks);
 for (let i = 0; i < pageViewUrls.length; i++) {
  const pageViewUrlsSlice = pageViewUrls.slice(i, i + 1);
  const timeoutDelayInMilliseconds = (2 * (i * 1000)) / REQUESTS_PER_SECOND;
  timeouts.push(
   () => new Promise((resolve) => {
    setTimeout(() => {
     const results = {};
     Promise.all(fetchUrls(pageViewUrlsSlice, 'months')).then((monthResults) => {
      results.months = monthResults;
      results.months.forEach(setViewAttribute(categoryLinks, i, 'views-months'));
      if (results.years) {
       resolve(results);
      }
     });
     Promise.all(fetchUrls(pageViewUrlsSlice, 'years')).then((yearResults) => {
      results.years = yearResults;
      results.years.forEach(setViewAttribute(categoryLinks, i, 'views-years'));
      if (results.months) {
       resolve(results);
      }
     });
    }, timeoutDelayInMilliseconds);
   }),
  );
 }

 Promise.all(timeouts.map((timeout) => timeout())).then(() => {
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
  movementButton.replaceChildren(new Text('done'));
 });
}

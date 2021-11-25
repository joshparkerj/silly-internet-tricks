const getPageViewsThisMonthButton = document.createElement('button');
getPageViewsThisMonthButton.innerText = 'get page views this month';

const getPageViewsThisMonth = function getPageViewsThisMonth() {
  getPageViewsThisMonthButton.setAttribute('disabled', true);
  const categoryLinks = document.querySelectorAll('#mw-pages li > a');

  // the api is documented at https://wikimedia.org/api/rest_v1/#/Pageviews%20data/get_metrics_pageviews_per_article__project___access___agent___article___granularity___start___end_
  const apiUrl = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/';
  const thisDate = new Date();
  const thisYear = thisDate.getFullYear();
  const thisMonth = thisDate.getMonth() + 1;
  const thisDay = thisDate.getDate();

  const today = `${thisYear}${thisMonth.toString().padStart(2, '0')}${thisDay.toString().padStart(2, '0')}`;

  const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;

  const lastMonthDate = `${thisYear}${lastMonth.toString().padStart(2, '0')}01`;

  const pageViewUrls = [...categoryLinks].map((a) => `${apiUrl}${a.href.match(/[^/]*$/)[0]}/monthly/${lastMonthDate}/${today}`);

  Promise.all(pageViewUrls.map((url) => (
    fetch(url)
      .then((r) => r.json())
      .then((json) => json.items[0].views)
  )))
    .then((results) => results.forEach((views, i) => { categoryLinks[i].innerText += ` (${views} page views this month)`; }));
};

getPageViewsThisMonthButton.addEventListener('click', getPageViewsThisMonth);

document.querySelector('#mw-pages > h2').appendChild(getPageViewsThisMonthButton);

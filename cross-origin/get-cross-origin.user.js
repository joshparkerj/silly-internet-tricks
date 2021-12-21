// ==UserScript==
// @name         get cross origin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Josh Parker
// @match        https://www.imdb.com/search/title/?year=2021&sort=num_votes,desc
// @icon         https://www.google.com/s2/favicons?domain=imdb.com
// @connect      www.rottentomatoes.com
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function getRT() {
  const rtRoot = 'https://www.rottentomatoes.com';
  // const certifiedFresh =
  //   '/assets/pizza-pie/images/icons/tomatometer/certified_fresh-notext.56a89734a59.svg';
  // const fresh = '/assets/pizza-pie/images/icons/tomatometer/tomatometer-fresh.149b5e8adc3.svg';
  // const rotten = '/assets/pizza-pie/images/icons/tomatometer/tomatometer-rotten.f1ef4f02ce3.svg';
  const rtSearch = '/search?search=';
  const works = [...document.querySelectorAll('.lister-item')];
  const parser = new DOMParser();
  works.forEach((work) => {
    const { title } = work.querySelector('h3.lister-item-header').innerText.match(/^(?<number>\S+) (?<title>.*) (?<year>\([^)]+\))$/).groups;
    const topBilled = work.querySelector('.lister-item-content > p > a[href^="/name"]');

    GM.xmlHttpRequest({
      method: 'GET',
      url: `${rtRoot}${rtSearch}${title} ${topBilled}`,
      onload({ responseText }) {
        const dom = parser.parseFromString(responseText, 'text/html');
        const spmr = dom.querySelector('search-page-media-row');
        const state = spmr.getAttribute('tomatometerstate');
        const score = spmr.getAttribute('tomatometerscore');
        const rtRating = document.createElement('div');
        const rtRatingContent = document.createElement('span');
        const rtTitle = dom.querySelector('search-page-media-row > a[slot=title]').textContent.trim();
        rtRatingContent.innerText = `Rotten tomatoes score for ${rtTitle}: ${score} (${state})`;
        rtRating.classList.add('inline-block');
        rtRating.classList.add('ratings-tomatometer');
        rtRating.appendChild(rtRatingContent);
        work.querySelector('div.ratings-bar').appendChild(rtRating);
      },
    });
  });
}());

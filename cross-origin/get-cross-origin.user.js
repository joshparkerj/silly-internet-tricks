// ==UserScript==
// @name         get cross origin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Josh Parker
// @match        https://www.imdb.com/search/title/?year=2021&sort=num_votes,desc
// @icon         https://www.google.com/s2/favicons?domain=imdb.com
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function getRT() {
  const rtRoot = 'https://www.rottentomatoes.com';
  const certifiedFresh = '/assets/pizza-pie/images/icons/tomatometer/certified_fresh-notext.56a89734a59.svg';
  const fresh = '/assets/pizza-pie/images/icons/tomatometer/tomatometer-fresh.149b5e8adc3.svg';
  const rotten = '/assets/pizza-pie/images/icons/tomatometer/tomatometer-rotten.f1ef4f02ce3.svg';
  const rtSearch = '/search?search=';
  const searchTerm = document.querySelector('h3.lister-item-header').innerText.replace(/^\S+/, '').trim();
  const parser = new DOMParser();
  GM.xmlHttpRequest({
    method: 'GET',
    url: rtRoot + rtSearch + searchTerm,
    onload({ responseText }) {
      const dom = parser.parseFromString(responseText, 'text/html');
      const spmr = dom.querySelector('search-page-media-row');
      console.log(spmr);
      const state = spmr.getAttribute('tomatometerstate');
      const score = spmr.getAttribute('tomatometerscore');
      document.querySelector('h3.lister-item-header').innerText += `Rotten tomatoes score: ${score} (${state})`;
    },
  });
}());

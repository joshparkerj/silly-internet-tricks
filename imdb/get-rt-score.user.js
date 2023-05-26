// ==UserScript==
// @name         get RT score
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
 const rtSearch = '/search?search=';
 const works = [...document.querySelectorAll('.lister-item')];
 const parser = new DOMParser();
 works.forEach((work) => {
  const { title, year } = work
   .querySelector('h3.lister-item-header')
   .innerText.match(/^(?<number>\S+) (?<title>.*) (?<year>\([^)]+\))$/).groups;
  const isTV = year.match(/[-–]/);
  const topBilled = work.querySelector('.lister-item-content > p > a[href^="/name"]').innerText;
  const searchUrl = `${rtRoot}${rtSearch}${title} ${topBilled}`.replaceAll(' ', '%20');
  GM.xmlHttpRequest({
   method: 'GET',
   url: searchUrl,
   onload({ responseText }) {
    const dom = parser.parseFromString(responseText, 'text/html');

    let spmr;
    if (isTV) spmr = dom.querySelector('search-page-result[type=tv] search-page-media-row');
    else spmr = dom.querySelector('search-page-media-row');

    const state = spmr.getAttribute('tomatometerstate');
    const score = spmr.getAttribute('tomatometerscore');
    const rtRating = document.createElement('div');
    const rtRatingContent = document.createElement('span');
    const rtTitle = spmr.querySelector('a[slot=title]').textContent.trim();
    rtRatingContent.innerText = `Rotten tomatoes score for ${rtTitle}: ${score} (${state})`;
    rtRating.classList.add('inline-block');
    rtRating.classList.add('ratings-tomatometer');
    rtRating.appendChild(rtRatingContent);
    work.querySelector('div.ratings-bar').appendChild(rtRating);
   },
  });
 });
}());

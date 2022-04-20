// ==UserScript==
// @name         More Results
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  load the second, third, and fourth pages of results (depending on viewport width)
// @author       Josh Parker
// @match        https://www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// ==/UserScript==

(function morResults() {
  // load the pages
  const parser = new DOMParser();

  const nextLink = document.querySelector('#pnnext');

  fetch(nextLink.href)
    .then((r) => r.text())
    .then((text) => parser.parseFromString(text, 'text/html'))
    .then((dom) => {
      console.log(dom);
    });
}());

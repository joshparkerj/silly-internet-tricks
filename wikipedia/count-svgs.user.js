// ==UserScript==
// @name         count svgs on each page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  count svgs on each page
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/Category:*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function getNumberOfSvgs() {
  const pageLinks = [...document.querySelectorAll('#mw-content-text #mw-pages .mw-content-ltr a[title]')];
  const parser = new DOMParser();
  const button = document.createElement('button');
  button.addEventListener('click', () => {
    pageLinks.forEach((pageLink) => {
      const { href } = pageLink;
      fetch(href)
        .then((r) => r.text())
        .then((text) => parser.parseFromString(text, 'text/html'))
        .then((dom) => dom.querySelectorAll('a[href$=svg]').length)
        .then((count) => {
          const p = document.createElement('p');
          const em = document.createElement('em');
          p.appendChild(em);
          em.innerText = `${count} svg link${count === 1 ? '' : 's'} found`;
          pageLink.appendChild(p);
        });
    });
  });

  button.innerText = 'get number of svgs on each page';
  document.querySelector('#mw-pages > h2 ~ p').appendChild(button);
}());

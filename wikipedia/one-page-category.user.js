// ==UserScript==
// @name         Show all category links on one page.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/wikipedia/one-page-category.user.js
// @downloadURL  https://gist.github.com/joshparkerj/3e8e7b624a12c4b4a9fcd3bb349be74f/raw/one-page-category.user.js
// @updateURL    https://gist.github.com/joshparkerj/3e8e7b624a12c4b4a9fcd3bb349be74f/raw/one-page-category.meta.js
// @match        https://en.wikipedia.org/wiki/Category:*
// @match        https://en.wikipedia.org/w/index.php?title=Category:*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function categoryOnePageUserScript() {
 let categoryArea = document.querySelector('div#mw-pages > div.mw-content-ltr');
 if (!categoryArea) {
  const mwPages = document.createElement('div');
  mwPages.id = 'mw-pages';
  categoryArea = document.createElement('div');
  categoryArea.classList.add('mw-content-ltr');
  mwPages.appendChild(categoryArea);
  document.querySelector('div#mw-content-text').after(mwPages);
 }

 const categoryPages = document.querySelector('div#mw-pages');
 const navLinks = [...categoryPages.childNodes].filter((node) => node.tagName === 'A');
 const nextLinks = navLinks.filter((a) => a.textContent.includes('next'));
 const previousLinks = navLinks.filter((a) => a.textContent.includes('previous'));
 const nextHref = nextLinks.length > 0 ? nextLinks[0].href : null;
 const previousHref = previousLinks.length > 0 ? previousLinks[0].href : null;
 const parser = new DOMParser();
 const getMorePages = function getMorePages(href, direction) {
  if (!href) {
   return;
  }

  fetch(href)
   .then((r) => r.text())
   .then((text) => parser.parseFromString(text, 'text/html'))
   .then((doc) => {
    const docLinks = [...doc.querySelectorAll('#mw-pages > a')].filter((a) => a.textContent.includes(direction));
    const docHref = docLinks.length > 0 ? docLinks[0].href : null;
    const docCategoryArea = doc.querySelector('#mw-pages > .mw-content-ltr').innerHTML;
    if (direction === 'next') {
     categoryArea.innerHTML += `<hr>${docCategoryArea}`;
    } else if (direction === 'previous') {
     categoryArea.innerHTML = `${docCategoryArea}<hr>${categoryArea.innerHTML}`;
    }

    getMorePages(docHref, direction);
   });
 };

 const getAllLaterPages = (href) => getMorePages(href, 'next');
 const getAllEarlierPages = (href) => getMorePages(href, 'previous');

 const showAllButton = document.createElement('button');
 showAllButton.innerText = 'show all';
 showAllButton.addEventListener('click', () => {
  showAllButton.setAttribute('disabled', true);
  getAllLaterPages(nextHref);
  getAllEarlierPages(previousHref);
 });

 if (nextHref || previousHref) {
  categoryPages.appendChild(showAllButton);
 }
}());

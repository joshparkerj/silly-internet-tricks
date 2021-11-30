// ==UserScript==
// @name         Traverse subcategory tree
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bring all articles from subcategories onto this category page
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/Category:*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function subcategoryTreeUserScript() {
    const parser = new DOMParser();
    const categoryArea = document.querySelector('div#mw-pages > div.mw-content-ltr');
  
    const traverseTree = function traverseTree(href) {
      if (!href) {
        return;
      }
  
      fetch(href)
        .then(r => r.text())
        .then(text => parser.parseFromString(text, 'text/html'))
        .then(doc => {
          categoryArea.innerHTML += `<hr><h3>${doc.querySelector('h1#firstHeading').innerText.replace('Category:','')}</h3>${doc.querySelector('#mw-pages > .mw-content-ltr').innerHTML}`;
          [...doc.querySelectorAll('div#mw-subcategories ul > li a')].forEach(({ href }) => traverseTree(href));
        });
    };
  
    const subcategoryHrefs = [...document.querySelectorAll('div#mw-subcategories ul > li a')].map(e => e.href);
    const getSubcategoryPagesButton = document.createElement('button');
    getSubcategoryPagesButton.innerText = 'get subcategory pages';
    getSubcategoryPagesButton.addEventListener('click', () => {
      getSubcategoryPagesButton.setAttribute('disabled', true);
      subcategoryHrefs.forEach(href => traverseTree(href));
    });
  
    if (subcategoryHrefs.length) {
      document.querySelector('div#mw-subcategories').appendChild(getSubcategoryPagesButton);
    }
  }());
  
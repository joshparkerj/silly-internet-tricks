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
  const DEFAULT_DEPTH = 3;
  const DEFAULT_MAX = 60;
  const parser = new DOMParser();
  const categoryArea = document.querySelector('div#mw-pages > div.mw-content-ltr');
  const subcategories = document.querySelector('div#mw-subcategories');
  const alreadyRetrieved = new Set();
  let max;

  const traverseTree = function traverseTree(href, depth, parent) {
    if (!href || depth < 1) {
      return;
    }

    fetch(href)
      .then(r => r.text())
      .then(text => parser.parseFromString(text, 'text/html'))
      .then(doc => {
        const title = doc.querySelector('h1#firstHeading').innerText.replace('Category:','');
        categoryArea.innerHTML += `<hr><h3 class="subcategory-title">${title} (parent category: ${parent})</h3>${doc.querySelector('#mw-pages > .mw-content-ltr').innerHTML}`;
        const children = [...doc.querySelectorAll('div#mw-subcategories ul > li a')].slice(0, max).filter(({ href }) => !alreadyRetrieved.has(href));
        max -= children.length;
        children.forEach(({ href }) => traverseTree(href, depth - 1, title));
      });

    alreadyRetrieved.add(href);
  };

  const subcategoryHrefs = [...subcategories.querySelectorAll('ul > li a')].map(e => e.href);
  const getSubcategoryPagesButton = document.createElement('button');
  getSubcategoryPagesButton.id = 'get-subcategory-pages';
  const buttonText = (depth, max) => `get subcategory pages (up to ${depth} layer${depth == 1 ? '' : 's'} deep; max ${max} subcategories)`;
  getSubcategoryPagesButton.innerText = buttonText(DEFAULT_DEPTH, DEFAULT_MAX);

  const layersInput = document.createElement('input');
  layersInput.id = 'layers';
  layersInput.type = 'number';
  layersInput.value = DEFAULT_DEPTH;

  const maxInput = document.createElement('input');
  maxInput.id = 'max';
  maxInput.type = 'number';
  maxInput.value = DEFAULT_MAX;

  const changeListener = () => { getSubcategoryPagesButton.innerText = buttonText(layersInput.value, maxInput.value); };

  layersInput.addEventListener('change', changeListener);
  maxInput.addEventListener('change', changeListener);

  getSubcategoryPagesButton.addEventListener('click', () => {
    getSubcategoryPagesButton.setAttribute('disabled', true);
    max = maxInput.value;
    const children = subcategoryHrefs.slice(0,max);
    max -= children.length;
    children.forEach(href => traverseTree(href, layersInput.value, document.querySelector('h1#firstHeading').innerText.replace('Category:','')));
  });

  if (subcategoryHrefs.length) {
    subcategories.appendChild(getSubcategoryPagesButton);
    subcategories.appendChild(layersInput);
    subcategories.appendChild(maxInput);
  }
}());

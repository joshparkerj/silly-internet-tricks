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

  const getSubcategoryPagesButton = document.createElement('button');
  getSubcategoryPagesButton.id = 'get-subcategory-pages';
  const buttonText = (depth, max) => `get subcategory pages (up to ${depth} layer${(+depth) === 1 ? '' : 's'} deep; max ${max} subcategories)`;
  getSubcategoryPagesButton.innerText = buttonText(DEFAULT_DEPTH, DEFAULT_MAX);

  const layersInput = document.createElement('input');
  layersInput.id = 'layers';
  layersInput.type = 'number';
  layersInput.value = DEFAULT_DEPTH;

  const maxInput = document.createElement('input');
  maxInput.id = 'max';
  maxInput.type = 'number';
  maxInput.value = DEFAULT_MAX;

  const changeListener = () => {
    getSubcategoryPagesButton.innerText = buttonText(layersInput.value, maxInput.value);
  };

  layersInput.addEventListener('change', changeListener);
  maxInput.addEventListener('change', changeListener);

  let count = 0;
  const disabledButtonText = () => { count += 1; return `${count} subcategories found`; };
  const parser = new DOMParser();
  let categoryArea = document.querySelector('div#mw-pages > div.mw-content-ltr');
  if (!categoryArea) {
    const mwPages = document.createElement('div');
    mwPages.id = 'mw-pages';
    categoryArea = document.createElement('div');
    categoryArea.classList.add('mw-content-ltr');
    mwPages.appendChild(categoryArea);
    document.querySelector('div#mw-content-text').after(mwPages);
  }

  let maxSubcategories;
  const alreadyRetrieved = new Set();
  const getAll = function getAll(doc, docHref) {
    return new Promise((resolve) => {
      let href = docHref;
      if (!href) {
        const docLinks = [...doc.querySelectorAll('#mw-pages > a')].filter((a) => a.textContent.includes('next'));
        href = docLinks.length > 0 ? docLinks[0].href : null;
      }

      if (!href) {
        resolve();
        return;
      }

      const docCategoryPages = doc.querySelector('div#mw-pages');
      const docCategoryArea = [...docCategoryPages.childNodes].find((node) => node.className === 'mw-content-ltr');
      fetch(href)
        .then((r) => r.text())
        .then((text) => parser.parseFromString(text, 'text/html'))
        .then((nextDoc) => {
          const nextDocCategoryArea = nextDoc.querySelector('#mw-pages > .mw-content-ltr').innerHTML;
          docCategoryArea.innerHTML += `<hr>${nextDocCategoryArea}`;

          const nextDocLinks = [...nextDoc.querySelectorAll('#mw-pages > a')].filter((a) => a.textContent.includes('next'));
          const nextDocHref = nextDocLinks.length > 0 ? nextDocLinks[0].href : null;
          if (nextDocHref) {
            getAll(doc, nextDocHref).then(() => resolve());
          } else {
            resolve();
          }
        });
    });
  };

  const traverseTree = function traverseTree(url, depth, parent) {
    if (!url || depth < 1) {
      return;
    }

    fetch(url)
      .then((r) => r.text())
      .then((text) => parser.parseFromString(text, 'text/html'))
      .then((doc) => {
        getAll(doc).then(() => {
          const title = doc.querySelector('h1#firstHeading').innerText.replace('Category:', '');
          categoryArea.appendChild(document.createElement('hr'));
          const subcategoryTitle = document.createElement('h3');
          subcategoryTitle.classList.add('subcategory-title');
          subcategoryTitle.appendChild(new Text(`${title} (parent category: ${parent})`));
          categoryArea.appendChild(subcategoryTitle);
          const docPages = doc.querySelector('#mw-pages > .mw-content-ltr');
          if (docPages) {
            categoryArea.innerHTML += docPages.innerHTML;
          } else {
            categoryArea.innerHTML += '<p>no pages</p>';
          }

          const children = [...doc.querySelectorAll('div#mw-subcategories ul > li a')].slice(0, maxSubcategories).filter(({ href }) => !alreadyRetrieved.has(href));
          maxSubcategories -= children.length;

          getSubcategoryPagesButton.innerText = disabledButtonText();
          children.forEach(({ href }) => traverseTree(href, depth - 1, title));
        });
      });

    alreadyRetrieved.add(url);
  };

  const subcategories = document.querySelector('div#mw-subcategories');
  if (subcategories) {
    const subcategoryHrefs = [...subcategories.querySelectorAll('ul > li a')].map(({ href }) => href);
    getSubcategoryPagesButton.addEventListener('click', () => {
      getSubcategoryPagesButton.setAttribute('disabled', true);
      layersInput.setAttribute('disabled', true);
      maxInput.setAttribute('disabled', true);
      maxSubcategories = maxInput.value;
      const children = subcategoryHrefs.slice(0, maxSubcategories);
      maxSubcategories -= children.length;
      children.forEach((href) => traverseTree(href, layersInput.value, document.querySelector('h1#firstHeading').innerText.replace('Category:', '')));
    });

    if (subcategoryHrefs.length) {
      subcategories.appendChild(getSubcategoryPagesButton);
      subcategories.appendChild(layersInput);
      subcategories.appendChild(maxInput);
    }
  }
}());

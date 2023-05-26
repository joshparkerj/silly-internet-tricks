// ==UserScript==
// @name         Nightcafe Collection Sort
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  collections to the top of the list if their names are in the prompts or title.
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/creation/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function collectionSort() {
  const containerSelector = '#modals .modal-body';
  const collectionSelector = `${containerSelector} label`;

  const sort = () => {
    const container = document.querySelector(containerSelector);
    const collections = document.querySelectorAll(collectionSelector);
    if (container.classList.contains('sorted') || !collections.length) return;

    container.classList.add('sorted');

    const textPrompts = [...document.querySelectorAll('#__next div[itemprop=mainEntity] p')]
      .filter((e) => e.textContent.includes('weight'))
      .map((e) => e.textContent.replace(/weight.*/, ''));

    const title = document.querySelector('body #__next [itemprop=mainEntity] h1:nth-child(1)').textContent;
    const text = `${textPrompts.join(' ')} ${title}`;

    const collectionStart = document.querySelector('.css-1ngh2e5');

    collections.forEach((collection) => {
      const collectionName = collection.textContent;
      if (text.includes(collectionName)) {
        const collectionClone = collection.cloneNode(true);
        collectionStart.insertAdjacentElement('afterend', collectionClone);
      }
    });
  };

  const mo = new MutationObserver(sort);

  mo.observe(document.querySelector('body'), { childList: true, subtree: true });
}());

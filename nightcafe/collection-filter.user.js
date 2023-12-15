// ==UserScript==
// @name         Nightcafe Collection Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  only show collections if their names are in the prompts or title.
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/creation/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function collectionFilter() {
 const containerSelector = '#modals .modal-body';
 const collectionSelector = `${containerSelector} label`;

 const filter = () => {
  const container = document.querySelector(containerSelector);
  const collections = document.querySelectorAll(collectionSelector);
  if (container.classList.contains('sorted') || !collections.length) return;

  container.classList.add('sorted');

  const textPrompts = [...document.querySelectorAll('#__next div[itemprop=mainEntity] p')]
   .filter((e) => e.textContent.includes('weight'))
   .map((e) => e.textContent
    .replace(/weight.*/, '')
    .replace(/\.\s?/g, '')
    .toLocaleLowerCase());

  const title = document
   .querySelector('body #__next [itemprop=mainEntity] h1:nth-child(1)')
   .textContent.toLocaleLowerCase();
  const text = `${textPrompts.join(' ')} ${title}`;

  collections.forEach((collection) => {
   const collectionName = collection.textContent.replace(/\.\s?/g, '').toLocaleLowerCase();
   const cnre = new RegExp(`\\b${collectionName}\\b`);
   if (!text.match(cnre)) {
    collection.parentElement.style.setProperty('display', 'none');
   }
  });
 };

 const mo = new MutationObserver(filter);

 mo.observe(document.querySelector('body'), { childList: true, subtree: true });
}());

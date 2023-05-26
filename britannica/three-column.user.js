// ==UserScript==
// @name         Three Column Reading
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  For long text. Three columns to reduce the need to scroll up and down.
// @author       Josh Parker
// @match        https://www.britannica.com/*
// @icon         https://www.google.com/s2/favicons?domain=britannica.com
// @grant        none
// ==/UserScript==

(function threeColumn() {
 let containerGrid2;
 let containerGrid3;
 const addColumns = () => {
  const container = document.querySelector('div.container');
  if (containerGrid2) container.removeChild(containerGrid2);
  if (containerGrid3) container.removeChild(containerGrid3);
  container.removeChild(containerGrid3);
  const containerGrid = document.querySelector('div.container > div.grid');
  container.style.setProperty('display', 'grid');
  container.style.setProperty('grid-template-columns', '1fr 1fr 1fr');
  container.style.setProperty('width', '100%');
  container.style.setProperty('max-width', 'unset');
  container.style.setProperty('margin', '0');
  container.style.setProperty('padding', '0');
  containerGrid.style.setProperty('grid-column', 'span 1');
  containerGrid2 = containerGrid.cloneNode(true);
  containerGrid2.style.setProperty('position', 'relative');
  containerGrid2.style.setProperty('top', '-100vh');
  containerGrid3 = containerGrid.cloneNode(true);
  containerGrid3.style.setProperty('position', 'relative');
  containerGrid3.style.setProperty('top', '-200vh');
  container.appendChild(containerGrid2);
  container.appendChild(containerGrid3);
 };

 const mutationObserver = new MutationObserver(() => {
  addColumns();
 });

 const ipc = document.querySelector('div.infinite-pagination-container');
 mutationObserver.observe(ipc, { subtree: true, childList: true });
 addColumns();
}());

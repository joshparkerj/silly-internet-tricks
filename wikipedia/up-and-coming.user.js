// ==UserScript==
// @name         up and coming pages in wikipedia category
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  movers from the past three years chart to the past three months chart
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/wikipedia/up-and-coming.user.js
// @downloadURL  https://gist.github.com/joshparkerj/41e576b304f01dced186633f3eb84c4c/raw/up-and-coming.user.js
// @updateURL    https://gist.github.com/joshparkerj/41e576b304f01dced186633f3eb84c4c/raw/up-and-coming.meta.js
// @match        https://en.wikipedia.org/wiki/Category:*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

import getMwPagesH2 from './get-mw-pages-h2';

import sortCategoryLinks from './sort-category-links';

import getChartMovement from './get-chart-movement';

(function upAndComingUserScript() {
 const sortButton = document.createElement('button');
 sortButton.innerText = 'sort by chart movement';
 const movementButton = document.createElement('button');
 movementButton.innerText = 'get chart movement';

 sortButton.addEventListener('click', () => sortCategoryLinks(sortButton, 'sort by chart movemenet'));

 movementButton.addEventListener('click', () => getChartMovement(
  movementButton,
  sortButton,
  'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/',
 ));

 getMwPagesH2().appendChild(movementButton);
}());

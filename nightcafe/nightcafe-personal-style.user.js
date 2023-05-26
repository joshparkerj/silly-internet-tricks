// ==UserScript==
// @name         Night Cafe Personal style
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get my prompt fragments and their frequencies
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/my-creations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

import getSearchablePromptText from './get-searchable-prompt-text';
import getTwoWordCombos from './get-two-word-combos';

(function nightCafePersonalPromptFilter() {
  const parser = new DOMParser();

  window.c = {};
  const seen = new Set();

  const findCreations = () => {
    const selector = 'h3 > a[href^="/creation"]';
    document.querySelectorAll(selector).forEach(async (link) => {
      const url = link.href;
      if (!seen.has(url)) {
        seen.add(url);

        console.log(`Now fetching creation number ${seen.size} at url ${url}`);

        const response = await fetch(url);
        const text = await response.text();
        const dom = parser.parseFromString(text, 'text/html');

        const searchablePromptText = getSearchablePromptText(dom);
        const twoWordCombos = getTwoWordCombos(searchablePromptText);
        twoWordCombos?.forEach((combo) => {
          if (!window.c[combo]) {
            window.c[combo] = {};
          }

          twoWordCombos.forEach((otherCombo) => {
            if (combo === otherCombo) return;

            if (!window.c[combo][otherCombo]) {
              window.c[combo][otherCombo] = {
                count: 1,
                creations: [url],
              };
            } else {
              window.c[combo][otherCombo].count += 1;
              window.c[combo][otherCombo].creations.push(url);
            }
          });
        });
      }
    });
  };

  findCreations();
  const mo = new MutationObserver(findCreations);

  mo.observe(document.querySelector('#__next > div'), { subtree: true, childList: true });
}());

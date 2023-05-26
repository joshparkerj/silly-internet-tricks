// ==UserScript==
// @name         Night Cafe Personal Prompt Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  filter my night cafe creations to ones with text prompts containing the search term
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/my-creations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function nightCafePersonalPromptFilter() {
  // For this first iteration, I'll probably hard code the search term here.
  const searchTerm = 'avalon';
  const parser = new DOMParser();

  const filterCreations = () => {
    const creationCards = [...document.querySelectorAll('.css-erlp54')];
    creationCards.forEach((card) => {
      const link = card.querySelector('[href^="/creation"]');
      fetch(link)
        .then((response) => response.text())
        .then((text) => {
          const dom = parser.parseFromString(text, 'text/html');
          const descriptiveElement = dom.querySelector('#__next [itemprop=mainEntity] .css-1gzn9ne > .css-ntik0p > .css-q8r9lz');
          if (descriptiveElement) {
            descriptiveElement.querySelectorAll('style').forEach((styleElement) => {
              styleElement.parentNode.removeChild(styleElement);
            });
            const textPrompts = descriptiveElement.textContent.match(/"[^"]*/g).filter((t) => !t.includes('weight')).map((t) => t.slice(1)).reduce((acc, e) => acc + e, '');
            if (!textPrompts.toLocaleLowerCase().includes(searchTerm)) {
              card.parentNode.removeChild(card);
            }
          } else {
            card.parentNode.removeChild(card);
          }
        });
    });
  };

  const mutationObserverCallback = () => {
    filterCreations();
  };

  const mo = new MutationObserver(mutationObserverCallback);

  mo.observe(document.querySelector('#__next > div'), { subtree: true, childList: true });
}());

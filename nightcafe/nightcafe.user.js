// ==UserScript==
// @name         Night Cafe Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/explore*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function nightCafe() {
  const urlFilter = new Set();
  const authorFilter = new Set();
  const parser = new DOMParser();
  const jsonOutput = {};

  document.addEventListener('click', ({ x, y }) => { console.log(x, y); });
  // return new Promise((resolve) => {
  //   document.addEventListener('click', ({ x, y }) => { resolve(`${x} ${y}`); });
  // });

  // for now, let's just filter on a hard-coded value.
  // If that goes well, then maybe let's think about adding user input for the filter value...

  // "trending on Artstation" is one of the most commonly used modifier phrases
  // in nightcafe text prompts.
  // const filterString = 'trending on Artstation';

  // We could use an empty string if we want to let everything through the filter.
  // const filterString = '';

  const fetchDetails = async (node) => {
    const author = node.querySelector('[rel=author]')?.href;
    const creationLink = node.querySelector('[href^="/creation"]')?.href;
    if (creationLink && !urlFilter.has(creationLink) && author && !authorFilter.has(author)) {
      urlFilter.add(creationLink);
      const fetchResponse = await fetch(creationLink);
      const textResponse = await fetchResponse.text();
      const dom = parser.parseFromString(textResponse, 'text/html');
      dom.querySelectorAll('style').forEach((styleElement) => {
        styleElement.parentNode.removeChild(styleElement);
      });

      console.log(creationLink);
      const descriptiveElement = dom.querySelector('#__next [itemprop=mainEntity] .css-1gzn9ne > .css-ntik0p > .css-q8r9lz');
      if (descriptiveElement) {
        const textPrompts = descriptiveElement.textContent.match(/"[^"]*/g).filter((t) => !t.includes('weight')).map((t) => t.slice(1));

        const headings2 = [...dom.querySelectorAll('div:nth-child(2) > h4')].map((h) => h.textContent);
        const headings3 = [...dom.querySelectorAll('div:nth-child(3) > h4')].map((h) => h.textContent);
        const details = [...dom.querySelectorAll(' #__next [itemProp=mainEntity] h2.css-0 + div *')].map((d) => d.textContent);
        const initialResolution = details[details.findIndex((e) => e === 'Initial Resolution') + 1];
        const runtime = details[details.findIndex((e) => e === 'Runtime') + 1];

        const noJsonStartImage = !textResponse.includes('"startImage":');
        const noStartImageHeading = !headings2.some((h4) => h4.includes('Start Image'));
        const noVideoSettingsHeading = !headings3.some((h4) => h4.includes('Video Settings'));
        const small = initialResolution === 'Thumb';
        const cheap = runtime === 'Short';

        if (noJsonStartImage && noStartImageHeading && noVideoSettingsHeading && small && cheap) {
          jsonOutput[creationLink] = { details, textPrompts };
          authorFilter.add(author);
        }
      }

      console.log(JSON.stringify(jsonOutput));
    }
  };

  const mutationObserverCallback = (mutationList) => {
    mutationList.forEach(({ addedNodes }) => {
      addedNodes.forEach(fetchDetails);
    });
  };

  const mo = new MutationObserver(mutationObserverCallback);

  mo.observe(document.querySelector('#__next > div'), { subtree: true, childList: true });
}());

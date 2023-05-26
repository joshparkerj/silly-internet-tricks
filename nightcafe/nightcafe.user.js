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
 const filter = new Set();
 const parser = new DOMParser();
 const jsonOutput = {};

 document.addEventListener('click', ({ x, y }) => {
  console.log(x, y);
 });
 //  return new Promise((resolve) => {
 // document.addEventListener('click', ({ x, y }) => { resolve(`${x} ${y}`); }); });

 // for now, let's just filter on a hard-coded value.
 // If that goes well, then maybe let's think about adding user input for the filter value...

 // "trending on Artstation" is one of the most commonly used modifier phrases
 // in nightcafe text prompts.
 const filterString = 'trending on Artstation';

 // We could use an empty string if we want to let everything through the filter.
 // const filterString = '';

 const fetchDetails = async (node) => {
  const author = node.querySelector('[rel=author]')?.href;
  const creationLink = node.querySelector('[href^="/creation"]')?.href;
  if (creationLink && author && !filter.has(author)) {
   const fetchResponse = await fetch(creationLink);
   const textResponse = await fetchResponse.text();
   const dom = parser.parseFromString(textResponse, 'text/html');
   const descriptiveElement = dom.querySelector(
    '#__next [itemprop=mainEntity] .css-1gzn9ne > .css-ntik0p > .css-q8r9lz',
   );
   if (descriptiveElement) {
    descriptiveElement.querySelectorAll('style').forEach((styleElement) => {
     styleElement.parentNode.removeChild(styleElement);
    });

    const textPrompts = descriptiveElement.textContent
     .match(/"[^"]*/g)
     .filter((t) => !t.includes('weight'))
     .map((t) => t.slice(1));

    if (textPrompts.some((textPrompt) => textPrompt.includes(filterString))) {
     jsonOutput[creationLink] = textPrompts;
     filter.add(author);
     console.log(filter.size);
    }
   }

   if (filter.size >= 64) {
    console.log(JSON.stringify(jsonOutput));
    // eslint-disable-next-line no-alert
    alert('YOUR JSON IS READY BABY! PLEASE CHECK CONSOLE!');
   }
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

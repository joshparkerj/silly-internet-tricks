// ==UserScript==
// @name         Night Cafe Get Top Creations using artist names.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/explore*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function nightCafe() {
  const parser = new DOMParser();

  const filter = new Set();

  const artistInitializer = () => ({ filter: new Set() });
  // const artistSerializer = (artist) => {
  //   const { filter, ...noFilter } = artist; return noFilter;
  // };

  const jsonOutput = {
    'Alex Hirsch': artistInitializer(),
    'Albert Gleizes': artistInitializer(),
    'Alphonse Mucha': artistInitializer(),
    'Amanda Sage': artistInitializer(),
    'Ben Bocquelet': artistInitializer(),
    'Bernie Wrightson': artistInitializer(),
    Canaletto: artistInitializer(),
    'Caspar David Friedrich': artistInitializer(),
    'Claude Monet': artistInitializer(),
    'Dan Mumford': artistInitializer(),
    'Dan Witz': artistInitializer(),
    'Edward Hopper': artistInitializer(),
    'Ferdinand Knab': artistInitializer(),
    'Georgy Kurasov': artistInitializer(),
    'Gerald Brom': artistInitializer(),
    'Greg Rutkowski': artistInitializer(),
    'Guido Borelli': artistInitializer(),
    'Gustav Klimt': artistInitializer(),
    'Gustave Doré': artistInitializer(),
    'H.R. Giger': artistInitializer(),
    'J.G. Quintel': artistInitializer(),
    'James Gurney': artistInitializer(),
    'Jean Tinguely': artistInitializer(),
    'Jim Burns': artistInitializer(),
    'Josephine Wall': artistInitializer(),
    'Julia Pott': artistInitializer(),
    Kandinsky: artistInitializer(),
    'Kelly Freas': artistInitializer(),
    'Leonid Afremov': artistInitializer(),
    'Max Ernst': artistInitializer(),
    Moebius: artistInitializer(),
    'Pablo Amaringo': artistInitializer(),
    'Pablo Picasso': artistInitializer(),
    'Pendleton Ward': artistInitializer(),
    Picasso: artistInitializer(),
    'Pino Daeni': artistInitializer(),
    'Rafael Santi': artistInitializer(),
    'Rebecca Sugar': artistInitializer(),
    'Roger Dean': artistInitializer(),
    'Salvador Dali': artistInitializer(),
    'Steven Belledin': artistInitializer(),
    'Steven Hillenberg': artistInitializer(),
    'Studio Ghibli': artistInitializer(),
    'Thomas Kinkade': artistInitializer(),
    'Tim Burton': artistInitializer(),
    'Van Gogh': artistInitializer(),
    'Wadim Kashin': artistInitializer(),
    'Wes Anderson': artistInitializer(),
    'Zdzisław Beksiński': artistInitializer(),
  };

  const fetchDetails = async (node) => {
    const author = node.querySelector('[rel=author]')?.href;
    const creationLink = node.querySelector('[href^="/creation"]')?.href;
    if (creationLink && author && !filter.has(author)) {
      filter.add(author);
      console.log(filter.size);
      const fetchResponse = await fetch(creationLink);
      const textResponse = await fetchResponse.text();
      const dom = parser.parseFromString(textResponse, 'text/html');
      const descriptiveElement = dom.querySelector('#__next [itemprop=mainEntity] .css-1gzn9ne > .css-ntik0p > .css-q8r9lz');
      if (descriptiveElement) {
        descriptiveElement.querySelectorAll('style').forEach((styleElement) => {
          styleElement.parentNode.removeChild(styleElement);
        });

        jsonOutput[creationLink] = descriptiveElement.textContent.match(/"[^"]*/g).filter((t) => !t.includes('weight')).map((t) => t.slice(1));
      }

      if (filter.size >= 64) {
        console.log(JSON.stringify(jsonOutput));
        // alert('YOUR JSON IS READY BABY! PLEASE CHECK CONSOLE!');
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

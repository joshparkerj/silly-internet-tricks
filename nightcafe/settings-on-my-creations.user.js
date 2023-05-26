// ==UserScript==
// @name         Settings on My Creations
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show full creation settings for each creation on my creations page.
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function settingsOnMyCreations() {
  const cardContainerSelector = '#__next div.css-16jqqjd + div > .css-0';
  const cardSelector = `${cardContainerSelector} > div`;
  const css = `
${cardContainerSelector} {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}

${cardSelector} {
  width: 15vw;
  grid-column: span 1;
}

${cardSelector} * {
  display: block;
  position: static;
  min-width: max-content;
  max-width: none;
  min-height: max-content;
  max-height: none;
}

${cardSelector} img {
  width: auto;
}

#__next div.css-1918gjp {
  margin: 0;
  max-width: none;
}
`;

  const style = document.createElement('style');
  style.appendChild(new Text(css));

  const body = document.querySelector('body');
  body.appendChild(style);

  const modifyMyCreations = () => {
    const cards = document.querySelectorAll(cardSelector);
    cards.forEach((card) => {
      const { href } = card.querySelector('a');
      console.log(href);
      card.querySelectorAll('*[style]').forEach((img) => {
        img.removeAttribute('style');
      });
    });
  };

  const mo = new MutationObserver(modifyMyCreations);
  mo.observe(document.querySelector('#__next'), { childList: true, subtree: true });

  modifyMyCreations();
}());

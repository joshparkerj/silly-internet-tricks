// ==UserScript==
// @name         Settings on My Creations (no grid)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Same as before, but fewer style changes!
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/my-creations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function settingsOnMyCreations() {
 const cardContainerSelector = '#__next div.css-16jqqjd + div > .css-0';
 const cardSelector = `${cardContainerSelector} > div`;
 const creationSettingsSelector = '[itemprop=mainEntity] div:nth-child(8) > .css-ntik0p';
 const css = `
#__next div.css-1918gjp {
  margin: auto;
  max-width: none;
}

.css-ntik0p.creation-settings-clone {
    position: relative;
    top: -400px;
    left: 400px;
    height: 0;
    max-width: ${window.innerWidth - 500}px;
}

.creation-settings-clone h2 + style + div > style + div > * {
    display: inline;
    margin-right: 0.5rem;
}

h3.css-1txomwt {
    max-width: 350px;
}
`;

 const style = document.createElement('style');
 style.appendChild(new Text(css));

 const body = document.querySelector('body');
 body.appendChild(style);
 body.addEventListener('click', ({ target }) => {
  if (target.tagName === 'A') {
   window.location.assign(target.href);
  }
 });

 const parser = new DOMParser();

 const modifyMyCreations = () => {
  const cards = document.querySelectorAll(cardSelector);
  cards.forEach(async (card) => {
   const cardA = card.querySelector('a');
   if (!cardA || card.classList.contains('checked-for-creation-settings')) return;

   card.classList.add('checked-for-creation-settings');
   const { href } = cardA;
   if (!href.includes('creator.nightcafe.studio/creation')) return;

   const response = await fetch(href);
   const html = await response.text();
   const dom = parser.parseFromString(html, 'text/html');
   const creationSettings = dom.querySelector(creationSettingsSelector);
   const creationSettingsClone = creationSettings.cloneNode(true);
   creationSettingsClone.classList.add('creation-settings-clone');
   creationSettingsClone
    .querySelectorAll('p')
    .forEach((p) => p.insertAdjacentElement('afterend', document.createElement('br')));

   card.appendChild(creationSettingsClone);
   card.style.setProperty('min-height', `${creationSettingsClone.scrollHeight}px`);
  });
 };

 const mo = new MutationObserver(modifyMyCreations);
 mo.observe(document.querySelector('#__next'), { childList: true, subtree: true });

 modifyMyCreations();
}());

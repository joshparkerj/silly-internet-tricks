// ==UserScript==
// @name         Get Collections
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the collections that the artist name belongs to
// @author       Josh Parker
// @match        https://aiartcreation.fandom.com/wiki/Artist_Directory_(Volcano_Comparison)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        none
// ==/UserScript==

(function getCollections() {
  const css = `
.wikia-gallery-item > .lightbox-caption > p {
    margin: 0;
}

.wikia-gallery-item > .lightbox-caption > p:nth-child(1) {
    border-top: solid black 1px;
}
  `;

  const style = document.createElement('style');
  style.appendChild(new Text(css));
  document.body.appendChild(style);

  const hrefs = [...document.querySelectorAll('li > a[href^="/wiki/Collection"]')].map((e) => e.href);

  const parser = new DOMParser();

  hrefs.forEach(async (href) => {
    const response = await fetch(href);
    const htmlText = await response.text();
    const dom = parser.parseFromString(htmlText, 'text/html');
    const artistNames = [...dom.querySelectorAll('div.lightbox-caption')].map((e) => e.textContent);
    const title = dom.querySelector('h1#firstHeading').textContent.trim().match(/Collection: (.*)/)[1];
    console.log(title);
    console.log(artistNames);
    artistNames.forEach((artistName) => {
      const artistLightboxCaption = [...document.querySelectorAll('div.lightbox-caption')].find((div) => div.textContent.includes(artistName));
      const paragraph = document.createElement('p');
      paragraph.appendChild(new Text(title));
      artistLightboxCaption.appendChild(paragraph);
    });
  });
}());

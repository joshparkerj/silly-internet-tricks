// ==UserScript==
// @name         Curating Collections
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  More efficiently categorize artist names (because there are kind of a lot)
// @author       Josh Parker
// @match        https://aiartcreation.fandom.com/wiki/Artist_Directory_(Volcano_Comparison)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        none
// ==/UserScript==

(function curatingCollections() {
  document.querySelectorAll('div.gallery-image-wrapper.accent,a.image.lightbox,div.thumb')
    .forEach((e) => e.style.removeProperty('height'));

  document.querySelectorAll('a.image.lightbox')
    .forEach((a) => a.style.setProperty('flex-direction', 'column'));

  const parser = new DOMParser();

  [...document.querySelectorAll('main a[href^="/wiki/Collection:"]')]
    .forEach(async ({ href }) => {
      const title = href.match(/:_(.*)$/)[1].replace(/_/g, ' ').replace(/%27/g, '\'');
      const response = await fetch(href);
      const responseText = await response.text();
      const dom = parser.parseFromString(responseText, 'text/html');

      [...dom.querySelectorAll('a.image.lightbox')]
        .forEach((a) => {
          const p = document.createElement('p');
          p.appendChild(new Text(title));
          const selector = `a[href="${a.href.match(/\/wiki.*/)[0]}"]`;
          document.querySelector(selector).appendChild(p);
        });
    });
}());

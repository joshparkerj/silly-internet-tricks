// ==UserScript==
// @name         show svgs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show svgs
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/wikipedia/show-svgs.user.js
// @downloadURL  https://gist.github.com/joshparkerj/387e6798a4b5cb2e64e21bb2daf7d6fc/raw/show-svgs.user.js
// @updateURL    https://gist.github.com/joshparkerj/387e6798a4b5cb2e64e21bb2daf7d6fc/raw/show-svgs.meta.js
// @match        https://en.wikipedia.org/wiki/*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function showSvgs() {
  const bodyContent = document.querySelector('#bodyContent');
  const button = document.createElement('button');
  button.innerText = 'show svgs';
  button.addEventListener('click', () => {
    button.disabled = true;
    const svgUrls = [...document.querySelectorAll('a[href$=svg]')].map((a) => a.href);
    const svgSection = document.createElement('section');
    svgSection.id = 'svgs';
    const parser = new DOMParser();
    svgUrls.forEach((url) => {
      const urlMatch = url.match(/https:\/\/en\.wikipedia\.org\/wiki\/File:(?<fileName>.*\.svg)/);
      if (urlMatch) {
        fetch(url)
          .then((r) => r.text())
          .then((text) => parser.parseFromString(text, 'text/html'))
          .then((dom) => dom.querySelector('.fullImageLink a[href$=svg]').href)
          .then((href) => {
            fetch(href)
              .then((r) => r.text())
              .then((text) => {
                const div = document.createElement('div');
                div.innerHTML = text;
                svgSection.appendChild(div);
              });
          });
      }
    });

    // document.styleSheets[0].insertRule('#svgs div, #svgs svg { width: 100px; }');
    bodyContent.appendChild(svgSection);
  });

  bodyContent.appendChild(button);
}());

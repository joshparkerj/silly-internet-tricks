// ==UserScript==
// @name         NightCafe Text To Image Form Style Fixes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  an attempt to eliminate scrolling on this form
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/create/text-to-image
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function nightcafeFormStyle() {
  const css = `
#__next .css-1gzn9ne .css-98oy26 {
  display: none;
}

div > hr {
  display: none;
}

.css-1lye7f1 span > img {
  display: none;
}

.css-1lye7f1 .css-gs7pop {
  display: none;
}

h3 + p {
  display: none;
}

.css-r6hgcc > .css-1gzn9ne {
  max-width: none;
  width: 100%;
}

.css-1dtemh2 {
  grid-column: span 6;
}
`;

  const style = document.createElement('style');
  style.appendChild(new Text(css));
  document.querySelector('body').appendChild(style);
  document.querySelectorAll('.css-1lye7f1 span > img').forEach((img) => img.style.removeProperty('display'));
}());

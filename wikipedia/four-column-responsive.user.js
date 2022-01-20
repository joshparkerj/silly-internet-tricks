// ==UserScript==
// @name         Four Column Responsive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  render text in as many as four columns, depending on display size
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function fourColumnResponsive() {
  const css = `
div#bodyContent {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

div#mw-content-text {
  grid-column: span 1;
  padding: 1em;
  position: relative;
}

div#mw-content-text:nth-child(7) {
  top: 0;
}

div#mw-content-text:nth-child(8) {
  top: -93vh;
}

div#mw-content-text:nth-child(9) {
  top: -187vh;
}

div#mw-content-text:nth-child(10) {
  top: -281vh;
}

div#mw-page-base {
  position: relative;
  z-index: 1;
}

div#mw-panel {
  z-index: 2;
}

h1#firstHeading {
  width: fit-content;
}
`;

  const style = document.createElement('style');
  style.appendChild(new Text(css));

  const mct = document.querySelector('div#mw-content-text');
  mct.insertAdjacentElement('afterend', style);
  mct.insertAdjacentElement('afterend', mct.cloneNode(true));
  mct.insertAdjacentElement('afterend', mct.cloneNode(true));
  mct.insertAdjacentElement('afterend', mct.cloneNode(true));
}());

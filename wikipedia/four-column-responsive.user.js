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
  grid-template-columns: repeat(12, 1fr);
}

div#mw-content-text {
  grid-column: span 3;
  padding: 1em;
  position: relative;
  border-right: 1px solid #bbc;
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

#siteSub, #contentSub, #contentSub2, #jump-to-nav {
  display: none;
}

div#catlinks {
  grid-column: span 12;
}

@media (max-width: 2000px) {
  div#mw-content-text:nth-child(10) {
    display: none;
  }

  div#mw-content-text {
    grid-column: span 4;
  }
}

@media (max-width: 1500px) {
  div#mw-content-text:nth-child(9) {
    display: none;
  }

  div#mw-content-text {
    grid-column: span 6;
  }
}

@media (max-width: 1000px) {
  div#mw-content-text:nth-child(8) {
    display: none;
  }

  div#mw-content-text {
    grid-column: span 12;
  }
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

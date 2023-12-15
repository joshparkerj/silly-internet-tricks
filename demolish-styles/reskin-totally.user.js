// ==UserScript==
// @name         Reskin Totally
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Eliminate all style and attempt to replace it with something somewhat decent
// @author       You
// @match        https://www.washingtonpost.com/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

(function reskinTotally() {
 [...document.styleSheets].forEach((styleSheet) => {
  while (styleSheet.cssRules.length > 0) {
   styleSheet.deleteRule(0);
  }
 });

 document.querySelectorAll('style').forEach((style) => {
  while (style.sheet.cssRules.length > 0) {
   style.sheet.deleteRule(0);
  }
 });

 document.querySelectorAll('*[style]').forEach((e) => {
  e.setAttribute('style', null);
 });

 document.styleSheets[0].insertRule(`@font-face {
      font-family: 'Gluten';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/gluten/v4/HhyVU5gk9fW7OUd_LNCHOoxCTQ.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }`);

 document.styleSheets[0].insertRule(`@font-face {
  font-family: 'Glory';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/glory/v5/q5uJsoi9Lf1w5vfImixCARxc.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`);

 document.styleSheets[0].insertRule(`:root {
    --blue-primary: hsl(200, 50%, 50%);
    --yellow-secondary: hsl(60, 100%, 50%);
    --orange-tertiary: hsl(30, 100%, 50%);
    --black-outline: hsl(300, 40%, 10%);

    --drab-primary: hsl(231, 18%, 35%);
    --drab-secondary: hsl(42, 78%, 25%);
    --drab-tertiary: hsl(12, 68%, 35%);

    --font-size-s: calc(0.75rem + 0.25vw);
    --font-size-m: calc(0.945rem + 0.315vw);
    --font-size-l: calc(1.19rem + 0.397vw);
    --font-size-xl: calc(1.5rem + 0.5vw);
    --font-size-xxl: calc(1.89rem + 0.63vw);
  }`);

 document.styleSheets[0].insertRule(`h1 {
    font-family: "Gluten", cursive;
    font-size: var(--font-size-xxl);
    font-weight: bold;
  }`);

 document.styleSheets[0].insertRule(`body {
    margin: 0;
    border: 2rem solid black;
    background-color: var(--blue-primary);
    color: var(--black-outline);
  }`);

 document.styleSheets[0].insertRule(`p {
    font-family: "Glory", sans-serif;
    font-size: var(--font-size-s);
    font-weight: normal;
  }`);

 document.styleSheets[0].insertRule(`a {
    color: var(--yellow-secondary);
  }`);

 document.styleSheets[0].insertRule(`a:hover {
    color: var(--orange-tertiary);
    background-image: linear-gradient(white, lightgray);
    box-shadow: 1px 6px 4px -3px var(--black-outline);
  }`);

 document.styleSheets[0].insertRule(`a:visited {
    color: var(--drab-secondary);
  }`);

 document.styleSheets[0].insertRule(`header nav > div {
    display: flex;
    justify-content: space-around;
  }`);

 document.styleSheets[0].insertRule(`h2, h3 {
    font-family: "Gemunu Libre", sans-serif;
    font-size: var(--font-size-xl);
    font-weight: normal;
    letter-spacing: calc(0.5953rem + 0.1984vw);
  }`);

 /*  document.styleSheets[0].insertRule(``);

    document.styleSheets[0].insertRule(``);

    document.styleSheets[0].insertRule(``);

    document.styleSheets[0].insertRule(``);

    document.styleSheets[0].insertRule(``);

    document.styleSheets[0].insertRule(``);
    */
}());

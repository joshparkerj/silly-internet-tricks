// ==UserScript==
// @name         Console Log Element
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Console Log Element
// @author       Josh Parker
// @match        http*://**/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// ==/UserScript==

(function consoleLogElement() {
  const logElement = ({ target }) => console.log(target);
  document.addEventListener('keydown', ({ code }) => {
    if (code === 'KeyL') {
      document.addEventListener('click', logElement);
    }
  });

  document.addEventListener('keyup', ({ code }) => {
    if (code === 'KeyL') {
      document.removeEventListener('click', logElement);
    }
  });
}());

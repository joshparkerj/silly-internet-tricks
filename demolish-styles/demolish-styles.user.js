// ==UserScript==
// @name         Demolish Style
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Eliminate all style totally
// @author       You
// @match        https://www.washingtonpost.com/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

(function demolishStyle() {
  const deleteRules = () => {
    const styleSheets = [...document.styleSheets];
    styleSheets.forEach((styleSheet) => {
      while (styleSheet.cssRules.length > 0) {
        styleSheet.deleteRule(0);
      }
    });
  };

  deleteRules();

  document.querySelectorAll('style').forEach((style) => {
    while (style.sheet.cssRules.length > 0) {
      style.sheet.deleteRule(0);
    }
  });

  document.querySelectorAll('*[style]').forEach((e) => {
    e.setAttribute('style', null);
  });
}());

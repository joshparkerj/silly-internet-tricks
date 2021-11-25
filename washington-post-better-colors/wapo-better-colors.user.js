// ==UserScript==
// @name         Washington Post better colors
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       You
// @match        https://*.washingtonpost.com/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const bodyElement = [...document.getElementsByTagName('body')][0];

  bodyElement.style.setProperty('text-shadow', 'rgb(127 204 102) 1px 1px 1px, rgb(204 102 127) -1px -1px 1px');
  bodyElement.style.setProperty('background-image', 'linear-gradient(45deg, #33ccff, #cc33ff)');

  const changeTextToRainbowText = function changeTextToRainbowText(element) {
    const elementLength = element.textContent.length;
    const singleLetterSpans = element.textContent.split('').map((c, i) => {
      const singleLetterSpan = document.createElement('span');
      singleLetterSpan.textContent = c;
      singleLetterSpan.style.setProperty('color', `hsl(${360 * i / elementLength} 100% 50%)`);
      return singleLetterSpan;
    });

    element.textContent = '';
    singleLetterSpans.forEach(span => element.appendChild(span));
  };

  const mainHeading = document.querySelector('.main-content h1');

  mainHeading.style.setProperty('font-size', '32px');
  changeTextToRainbowText(mainHeading);

  changeTextToRainbowText(document.querySelector('h1#main-content'));
})();

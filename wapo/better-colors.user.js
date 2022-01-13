// ==UserScript==
// @name         Washington Post better colors
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       Josh Parker
// @match        https://*.washingtonpost.com/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

(function betterColors() {
  const bodyElement = [...document.getElementsByTagName('body')][0];

  const setMainColors = function setMainColors(element) {
    element.style.setProperty('text-shadow', 'rgb(127 204 102) 1px 1px 1px, rgb(204 102 127) -1px -1px 1px');
    element.style.setProperty('background-image', 'linear-gradient(45deg, #33ccff, #cc33ff)');
    element.style.setProperty('background-attachment', 'fixed');
  };

  setMainColors(bodyElement);

  const styleSheets = [...document.styleSheets];

  for (let i = 0; i < styleSheets.length; i++) {
    const styleSheet = styleSheets[i];
    const j = [...styleSheet.cssRules].findIndex((rule) => rule.selectorText === '#pb-root' && rule.cssText.includes('background'));
    if (j !== -1) {
      const { cssText } = styleSheet.cssRules[i];
      styleSheet.deleteRule(i);
      styleSheet.insertRule(cssText.replace(/background:[^;]+; /, ''));
      break;
    }
  }

  const changeTextToRainbowText = function changeTextToRainbowText(element) {
    const e = element;
    const elementLength = e.textContent.length;
    const singleLetterSpans = e.textContent.split('').map((c, i) => {
      const singleLetterSpan = document.createElement('span');
      singleLetterSpan.textContent = c;
      singleLetterSpan.style.setProperty('color', `hsl(${(900 * i) / elementLength} 100% 50%)`);
      return singleLetterSpan;
    });

    e.textContent = '';
    singleLetterSpans.forEach((span) => e.appendChild(span));
  };

  const mainHeading = document.querySelector('.main-content h1');
  const mainHeadingType2 = document.querySelector('h1#main-content');
  const topContentHeading = document.querySelector('#top-content h1');

  if (mainHeading) {
    mainHeading.style.setProperty('font-size', '32px');
    changeTextToRainbowText(mainHeading);
  } else if (mainHeadingType2) {
    changeTextToRainbowText(mainHeadingType2);
    const mainHeadingObserver = new MutationObserver((_, observer) => {
      changeTextToRainbowText(mainHeadingType2);
      observer.disconnect();
    });
    mainHeadingObserver.observe(mainHeadingType2, { childList: true });
  } else if (topContentHeading) {
    changeTextToRainbowText(topContentHeading);
    topContentHeading.style.setProperty('text-shadow', 'rgba(127,204,102,.5) 10px 10px 10px, rgba(204,102,127,.5) -10px -10px 10px');
    topContentHeading.style.setProperty('padding', '32px');
  }
}());

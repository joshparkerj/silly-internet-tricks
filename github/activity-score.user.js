// ==UserScript==
// @name         Commit activity score
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Produce a score (formula dfma)
// @author       Josh Parker
// @match        https://github.com/**/commits/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function activityScore() {
  const div = document.createElement('div');
  div.style.setProperty('position', 'fixed');
  div.style.setProperty('top', '20vh');
  div.style.setProperty('left', '5vw');

  const scorer = (tc) => {
    if (tc.includes('hours') || tc.includes('minutes')) {
      return 30;
    }

    if (tc.includes('days')) {
      return 30 * (1 / Math.log(Number(tc.split(' ')[0])));
    }

    const days = (new Date() - new Date(tc.slice(3))) / 24 / 60 / 60 / 1000;
    return 30 * (1 / Math.log(Math.floor(days)));
  };

  div.appendChild(new Text(`ACTIVITY SCORE: ${Math.floor([...document.querySelectorAll('.Details relative-time')].map(({ textContent }) => scorer(textContent)).reduce((a, b) => a + b))}`));

  document.querySelector('body').appendChild(div);
}());

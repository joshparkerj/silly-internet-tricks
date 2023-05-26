// ==UserScript==
// @name         Arrow Key Navigation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Arrow Key Navigation
// @author       Josh Parker
// @match        https://www.egscomics.com/comic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=egscomics.com
// @grant        none
// ==/UserScript==

(function arrowKeyNavigation() {
  const next = () => document.querySelector('a.cc-next').click();
  const previous = () => document.querySelector('a.cc-prev').click();
  document.addEventListener('keydown', ({ code }) => {
    if (code === 'ArrowRight') {
      next();
    } else if (code === 'ArrowLeft') {
      previous();
    }
  });
}());

// ==UserScript==
// @name         Delete Element
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hold d and click to remove something to help get a clean printout or screenshot.
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function deleteElement() {
  const body = document.querySelector('body');

  const lastDeleted = [];

  const handler = (event) => {
    event.preventDefault();
    const { target } = event;
    const display = target.style.getPropertyValue('display');

    target.style.setProperty('display', 'none');
    lastDeleted.push({ target, display });
  };

  body.addEventListener('keydown', ({ code }) => {
    if (code === 'KeyD') {
      body.addEventListener('click', handler);
    }
  });

  body.addEventListener('keyup', ({ code }) => {
    if (code === 'KeyD') {
      body.removeEventListener('click', handler);
    }
  });

  body.addEventListener('keypress', ({ code }) => {
    if (code === 'KeyZ') {
      const { target, display } = lastDeleted.pop();
      if (target) {
        target.style.removeProperty('display');
        if (display) {
          target.style.setProperty('display', display);
        }
      }
    }
  });
}());

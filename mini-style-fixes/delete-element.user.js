// ==UserScript==
// @name         Delete Element
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hold d and click to remove something. Can help you get a nice clean printout.
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function deleteElement() {
  const body = document.querySelector('body');

  const lastDeleted = [];

  const handler = ({ target }) => {
    target.style.setProperty('display', 'none');
    lastDeleted.push(target);
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
      const e = lastDeleted.pop();
      if (e) {
        e.style.removeProperty('display');
      }
    }
  });
}());

// ==UserScript==
// @name         Log Element
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hold l and click to see it logged to the developer console
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function deleteElement() {
  const body = document.querySelector('body');

  const resetBorder = (() => {
    let last = null;
    return (e) => {
      if (e) {
        last = e;
      } else if (last) {
        const { target, border } = last;
        target.style.removeProperty('border');
        if (border) {
          target.style.setProperty('border', border);
        }

        last = null;
      }
    };
  })();

  const addBorder = ({ target }) => {
    resetBorder();

    const border = target.style.getPropertyValue('border');
    target.style.setProperty('border', 'dotted 2px chartreuse');
    resetBorder({ target, border });
  };

  const handler = (event) => {
    event.preventDefault();
    const { target } = event;

    // eslint-disable-next-line no-console
    console.log(target);
  };

  let hoverTarget = null;
  let holdingD = false;

  const findHoverTarget = ({ target }) => {
    hoverTarget = target;
  };

  body.addEventListener('mouseover', findHoverTarget);

  body.addEventListener('keydown', ({ code }) => {
    if (code === 'KeyL') {
      body.addEventListener('click', handler);
      if (!holdingD) {
        addBorder({ target: hoverTarget });
      }

      holdingD = true;
      body.addEventListener('mouseover', addBorder);
    }
  });

  body.addEventListener('keyup', ({ code }) => {
    if (code === 'KeyL') {
      body.removeEventListener('click', handler);

      holdingD = false;
      body.removeEventListener('mouseover', addBorder);
      resetBorder();
    }
  });
}());

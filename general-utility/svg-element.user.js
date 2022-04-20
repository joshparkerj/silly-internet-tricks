// ==UserScript==
// @name         SVG Element
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hold s and click to log an svg version of the element to the developer console
// @author       Josh Parker
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function svgElement() {
  const body = document.querySelector('body');
  const parser = new DOMParser();
  const xmlSerializer = new XMLSerializer();

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

    resetBorder();

    const newElement = parser.parseFromString(target.outerHTML, 'text/html').querySelector('body > *');
    const setStyles = (n00b, old) => {
      const n00bComputedStyle = getComputedStyle(n00b);
      const oldComputedStyle = getComputedStyle(old);

      Object.keys(n00bComputedStyle).filter(
        (key) => n00bComputedStyle[key] !== oldComputedStyle[key],
      ).forEach(
        (key) => n00b.style.setProperty(key, oldComputedStyle[key]),
      );
    };

    const setAllStyles = (n00b, old) => {
      setStyles(n00b, old);
      [...n00b.children].forEach((child, n) => {
        setAllStyles(child, old.children[n]);
      });
    };

    setAllStyles(newElement, target);

    const svg = document.createElement('svg');

    const { width, height } = target.getBoundingClientRect();

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const foreignObject = document.createElement('foreignobject');
    foreignObject.setAttribute('x', '0');
    foreignObject.setAttribute('y', '0');
    foreignObject.setAttribute('width', width);
    foreignObject.setAttribute('height', height);

    svg.appendChild(foreignObject);

    newElement.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

    foreignObject.innerHTML = xmlSerializer.serializeToString(newElement);

    // eslint-disable-next-line no-console
    // console.log(svg);
    body.appendChild(svg);
  };

  let hoverTarget = null;
  let holdingD = false;

  const findHoverTarget = ({ target }) => {
    hoverTarget = target;
  };

  body.addEventListener('mouseover', findHoverTarget);

  body.addEventListener('keydown', ({ code }) => {
    if (code === 'KeyD') {
      body.addEventListener('click', handler);
      if (!holdingD) {
        addBorder({ target: hoverTarget });
      }

      holdingD = true;
      body.addEventListener('mouseover', addBorder);
    }
  });

  body.addEventListener('keyup', ({ code }) => {
    if (code === 'KeyD') {
      body.removeEventListener('click', handler);

      holdingD = false;
      body.removeEventListener('mouseover', addBorder);
      resetBorder();
    }
  });
}());

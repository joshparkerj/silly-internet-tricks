// ==UserScript==
// @name         Roughify Svgs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Roughify Svgs
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/wikipedia/roughify-svgs.user.js
// @downloadURL  https://gist.github.com/joshparkerj/b61746e7f95aa03ffb4ac303bc01aa52/raw/roughify-svgs.user.js
// @updateURL    https://gist.github.com/joshparkerj/b61746e7f95aa03ffb4ac303bc01aa52/raw/roughify-svgs.meta.js
// @match        https://en.wikipedia.org/wiki/*
// @require      https://unpkg.com/roughjs@latest/bundled/rough.js
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

/* globals rough */
(function roughifySvgs() {
  const bodyContent = document.querySelector('#bodyContent');
  const button = document.createElement('button');
  button.innerText = 'roughify svgs';
  button.addEventListener('click', () => {
    button.disabled = true;
    const svgs = [...document.querySelectorAll('svg')];
    const newSvgSection = document.createElement('div');
    // newSvgSection.id = 'new-svgs';
    svgs.forEach((svg) => {
      const newSvg = document.createElement('svg');
      ['width', 'height', 'xmlns'].forEach((attr) => newSvg.setAttribute(attr, svg.getAttribute(attr)));
      const rns = rough.svg(newSvg);
      const paths = [...svg.querySelectorAll('path')];
      paths.forEach((path) => {
        // console.log(path.outerHTML);
        const d = path.getAttribute('d');
        const fill = path.getAttribute('fill');
        const stroke = path.getAttribute('stroke');
        const strokeWidth = path.getAttribute('stroke-width');
        const styleOptions = {
          fillStyle: 'solid',
          strokeWidth: 0.5,
        };

        if (fill) styleOptions.fill = fill;
        if (stroke) styleOptions.stroke = stroke;
        if (strokeWidth) styleOptions.strokeWidth = strokeWidth / 2;

        newSvg.appendChild(rns.path(d, styleOptions));
      });

      const lines = [...svg.querySelectorAll('line')];
      lines.forEach((line) => {
        const x1 = line.getAttribute('x1');
        const x2 = line.getAttribute('x2');
        const y1 = line.getAttribute('y1');
        const y2 = line.getAttribute('y2');
        newSvg.appendChild(rns.line(x1, y1, x2, y2));
      });

      const div = document.createElement('div');
      div.appendChild(newSvg);
      newSvgSection.appendChild(div);
    });

    bodyContent.appendChild(newSvgSection);
  });

  bodyContent.appendChild(button);
}());

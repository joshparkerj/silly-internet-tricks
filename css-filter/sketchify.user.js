// ==UserScript==
// @name         Sketchify Page!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  use a simple sketch effect on any page
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function sketchifyPage() {
  const filter = document.createElement('div');

  filter.innerHTML = `
<svg width="0">
<filter id="sketch-filter">
  <feColorMatrix in="SourceGraphic" result="desaturated"
    type="matrix"
    values=" 0.3  0.3  0.3    0    0
             0.3  0.3  0.3    0    0
             0.3  0.3  0.3    0    0
               0    0    0    1    0"
  />
  <feColorMatrix in="desaturated" result="inverted"
    type="matrix"
    values=" -1  0  0  0  1
              0 -1  0  0  1
              0  0 -1  0  1
              0  0  0  1  0"
  />
  <feGaussianBlur in="inverted" stdDeviation="3" result="blurred" />
  <feBlend in="desaturated" in2="blurred" mode="color-dodge" result="light-sketch" />
  <feColorMatrix in="light-sketch" result="darkened"
    type="matrix"
    values="   3   0   0   0   -2
               0   3   0   0   -2
               0   0   3   0   -2
               0   0   0   1    0"
  />
</filter>
</svg>
`;

  const body = document.querySelector('body');
  body.appendChild(filter);
  body.style.setProperty('filter', 'url(#sketch-filter)');
}());

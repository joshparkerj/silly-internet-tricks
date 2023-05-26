// ==UserScript==
// @name         Spot Light!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  use a spot light
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function spotLight() {
 const diffuseSpotLightingFilter = document.createElement('div');
 const fraction = (num, den) => (n) => Math.round((num * n) / den);
 const half = fraction(1, 2);
 diffuseSpotLightingFilter.innerHTML = `
<svg width="0">
<filter id="diffuse-spot-lighting">
  <feColorMatrix in="SourceGraphic" result="alpha-matrix"
        type="matrix"
        values=" 0  0  0  0  0
                 0  0  0  0  0
                 0  0  0  0  0
                -1 -1 -1  1  0" />
    <feDiffuseLighting in="alpha-matrix" surfaceScale="${fraction(
  1,
  16,
 )(window.innerHeight + window.innerWidth)}" result="spotlight" >
    <feSpotLight
      x="${half(window.innerWidth)}"
      y="0"
      z="${fraction(1, 8)(window.innerHeight + window.innerWidth)}"
      pointsAtX="${half(window.innerWidth)}"
      pointsAtY="${half(window.innerHeight)}"
      pointsAtZ="0"
      limitingConeAngle="20" >
    </feSpotLight>
  </feDiffuseLighting>
  <feFlood flood-color="gainsboro" flood-opacity="1" result="gainsboro" />
  <feBlend in="SourceGraphic" in2="gainsboro" mode="darken" result="darkened" />
  <feComposite in="darkened" in2="spotlight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
</filter>
</svg>
`;
 const body = document.querySelector('body');
 const lightSource = diffuseSpotLightingFilter.querySelector('feSpotLight');
 body.addEventListener('pointermove', ({ x, y }) => {
  lightSource.setAttribute('pointsAtX', x + window.scrollX);
  lightSource.setAttribute('pointsAtY', y + window.scrollY);
 });
 let pos = 0;
 setInterval(() => {
  pos += 20;
  pos %= 2 * (window.innerWidth + window.innerHeight);
  if (pos < window.innerWidth) {
   lightSource.setAttribute('x', window.scrollX + pos);
   lightSource.setAttribute('y', window.scrollY);
  } else if (pos < window.innerWidth + window.innerHeight) {
   lightSource.setAttribute('x', window.scrollX + window.innerWidth);
   lightSource.setAttribute('y', window.scrollY + (pos - window.innerWidth));
  } else if (pos < 2 * window.innerWidth + window.innerHeight) {
   lightSource.setAttribute(
    'x',
    window.scrollX + window.innerWidth - (pos - (window.innerWidth + window.innerHeight)),
   );
   lightSource.setAttribute('y', window.scrollY + window.innerHeight);
  } else {
   lightSource.setAttribute('x', window.scrollX);
   lightSource.setAttribute(
    'y',
    window.scrollY + window.innerHeight - (pos - (2 * window.innerWidth + window.innerHeight)),
   );
  }
 }, 50);
 body.appendChild(diffuseSpotLightingFilter);
 body.style.setProperty('filter', 'url(#diffuse-spot-lighting)');
}());

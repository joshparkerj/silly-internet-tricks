// ==UserScript==
// @name         Github fixed ui
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix the ui at the top of the page so you can see it when scrolling a long readme
// @author       Josh Parker
// @match        https://github.com/*/*
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @grant        none
// ==/UserScript==

(function fixedUi() {
  const jhwHeader = document.querySelector('div.js-header-wrapper > header');
  jhwHeader.style.setProperty('position', 'fixed');
  jhwHeader.style.setProperty('width', '100%');
  jhwHeader.style.setProperty('height', '4rem');

  const rch = document.querySelector('#repository-container-header');
  rch.style.setProperty('position', 'fixed');
  rch.style.setProperty('background-color', 'white');
  rch.style.setProperty('width', '100%');
  rch.style.setProperty('z-index', '100');
  rch.style.setProperty('top', '4rem');

  const sib = document.querySelector('#repository-container-header + div');
  sib.style.setProperty('position', 'relative');
  sib.style.setProperty('top', '12rem');

  const footer = document.querySelector('footer.footer');
  footer.style.setProperty('position', 'relative');
  footer.style.setProperty('top', '12rem');

  const dls = document.querySelector('div.Layout-sidebar');
  dls.style.setProperty('position', 'fixed');
  dls.style.setProperty('top', '12rem');
  dls.style.setProperty('right', '7rem');
}());

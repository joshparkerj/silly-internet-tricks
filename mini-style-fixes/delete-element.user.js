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
  const display = target.style.getPropertyValue('display');

  target.style.setProperty('display', 'none');
  lastDeleted.push({ target, display });
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

 body.addEventListener('keypress', ({ code }) => {
  if (code === 'KeyZ') {
   const e = lastDeleted.pop();
   if (e) {
    const { target, display } = e;
    target.style.removeProperty('display');
    if (display) {
     target.style.setProperty('display', display);
    }
   }
  }
 });
}());

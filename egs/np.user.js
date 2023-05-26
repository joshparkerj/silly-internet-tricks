// ==UserScript==
// @name         El Goonish Shive Newspaper. No Ads!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.egscomics.com/egsnp/*
// @grant        none
// ==/UserScript==

(function egsNp() {
 document.addEventListener(
  'keydown',
  (event) => event.code === 'ArrowRight'
   && document.querySelector('#cc-comicbody ~ .cc-nav .cc-next').click(),
 );
 document.addEventListener(
  'keydown',
  (event) => event.code === 'ArrowLeft' && document.querySelector('#cc-comicbody ~ .cc-nav .cc-prev').click(),
 );
 const clear = function clear() {
  [...document.querySelectorAll('body > *')].forEach((e) => e.setAttribute('style', 'display:none;'));
  document.querySelector('#wrapper')?.setAttribute('style', 'display:block;');
  [...document.querySelectorAll('#wrapper > *')].forEach((e) => e.setAttribute('style', 'display:none;'));
  document
   .querySelector('#menu + div + div')
   ?.setAttribute('style', 'display:block;background-color:white;');
 };
 clear();
 setInterval(clear, 20); // reclear 50 times per second
}());

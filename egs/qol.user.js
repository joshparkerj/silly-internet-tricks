// ==UserScript==
// @name         El Goonish Shive. No ads. No commentary. No Q&A.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       joshparkerj
// @match        https://www.egscomics.com/comic/*
// @grant        none
// ==/UserScript==

(function qol() {
  if (document.querySelector('option[selected]').text.includes('Q&A')) {
    const next = document.querySelector('option[selected] ~ option');
    if (next) {
      window.open(`https://www.egscomics.com/comic/${window.associds[document.querySelector('option[selected] ~ option').value]}`, '_self');
    }
  }

  document.querySelector('#wrapper')?.setAttribute('style', 'width:100%;');
  document.querySelector('#footer')?.setAttribute('style', 'display:none;');
  document.querySelector('#news')?.setAttribute('style', 'display:none;');
  document.querySelector('#hw-jumpbar')?.setAttribute('style', 'display:none;');
  document.querySelector('#menu')?.setAttribute('style', 'display:none;');
  document.querySelector('#rightarea')?.setAttribute('style', 'display:none;');
  document.querySelector('#header')?.setAttribute('style', 'display:none;');
  document.querySelector('#ibar')?.setAttribute('style', 'display:none;');
  document.querySelector('.vm-skin')?.setAttribute('style', 'display:none;');
  const rightarea = document.querySelector('#rightarea');
  const header = document.querySelector('#header');
  document.addEventListener('keydown', (event) => event.code === 'ArrowRight' && document.querySelector('#cc-comicbody ~ .cc-nav .cc-next').click());
  document.addEventListener('keydown', (event) => event.code === 'ArrowLeft' && document.querySelector('#cc-comicbody ~ .cc-nav .cc-prev').click());
  document.querySelector('#leftarea')?.setAttribute('style', 'margin:auto;float:none;padding:0;');

  if (header) {
    header.innerHTML = '';
  }

  if (rightarea) {
    rightarea.innerHTML = '';
  }
}());

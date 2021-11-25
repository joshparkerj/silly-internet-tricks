// ==UserScript==
// @name         Zanyify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  twist the text for a zany effect
// @author       Josh Parker
// @match        https://www.washingtonpost.com/*
// @match        https://www.google.com/*
// @match        https://en.wikipedia.org/wiki/*
// @match        https://www.tampermonkey.net/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

(function zanyifyUserScript() {
  const body = document.querySelector('body');
  const existingTextManips = document.querySelector('body > div.josh-text-manips');
  const joshTextManips = existingTextManips || document.createElement('div');
  joshTextManips.className = 'josh-text-manips';
  const zanyifyButton = document.createElement('button');
  zanyifyButton.innerText = 'zanyify';

  const changeTextToZanyText = function changeTextToZanyText(element) {
    const e = element;
    const singleLetterSpans = e.textContent.split('').map((c) => {
      const singleLetterSpan = document.createElement('span');
      singleLetterSpan.textContent = c;
      singleLetterSpan.style.setProperty('transform', `rotate(${Math.random() / 2 - 0.25}turn)`);
      return singleLetterSpan;
    });

    e.textContent = '';
    singleLetterSpans.forEach((span) => e.appendChild(span));
  };

  const zanyify = function zanyify({ target }) {
    const e = target;
    body.removeEventListener('mousedown', zanyify);

    const singleLetterSpans = e.textContent.split('').map((c) => {
      const singleLetterSpan = document.createElement('span');
      singleLetterSpan.textContent = c;
      return singleLetterSpan;
    });

    e.textContent = '';
    singleLetterSpans.forEach((span) => e.appendChild(span));

    const zanyifyMouseover = ({ target: mouseoverTarget }) => {
      const f = mouseoverTarget;
      if (f.tagName === 'SPAN') {
        f.className = 'selected';
      }
    };

    e.addEventListener('mouseover', zanyifyMouseover);

    const zanyifyMouseup = () => {
      e.removeEventListener('mouseup', zanyifyMouseup);
      e.removeEventListener('mouseover', zanyifyMouseover);
      const text = e.textContent;
      const classNames = [...e.childNodes].map((node) => node.className);
      const selectionStart = classNames.indexOf('selected');
      const selectionEnd = classNames.lastIndexOf('selected') + 1;
      e.innerHTML = `${text.slice(0, selectionStart)}<span class='zany-text'>${text.slice(selectionStart, selectionEnd)}</span>${text.slice(selectionEnd)}`;
      changeTextToZanyText(e.querySelector('span.zany-text'));
      zanyifyButton.removeAttribute('disabled');
    };

    e.addEventListener('mouseup', zanyifyMouseup);
  };

  zanyifyButton.addEventListener('click', () => {
    zanyifyButton.setAttribute('disabled', true);
    body.addEventListener('mousedown', zanyify);
  });

  joshTextManips.appendChild(zanyifyButton);
  if (!existingTextManips) {
    body.appendChild(joshTextManips);
  }

  document.styleSheets[0].insertRule('.josh-text-manips {position: fixed;background-color: lightgrey;padding: 5px 10px;top: 62px;right: 10px;border-radius: 16px;box-shadow: 2px 2px 1px black;}');
}());

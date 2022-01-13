// ==UserScript==
// @name         Sarcastify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  apply sarcastic capitalization to the text you select
// @author       Josh Parker
// @match        https://www.washingtonpost.com/*
// @match        https://www.google.com/*
// @match        https://en.wikipedia.org/wiki/*
// @match        https://www.tampermonkey.net/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

(function sarcastifyUserScript() {
  /* This section is unique to the sarcastic effect */
  const buttonText = 'sarcastify';
  const effectClassName = 'sarcastic-text';
  const applyTextEffect = function applySarcasticEffect(element) {
    const e = element;
    const sarcasticCase = function sarcasticCase(char, i) {
      if (i % 2) {
        return char.toLocaleLowerCase();
      }

      return char.toLocaleUpperCase();
    };

    e.textContent = e.textContent.split('').map(sarcasticCase).join('');
  };

  /* The rest is common to all of the text effects.
     It's duplicated in each script
     because I want them each to be usable as a stand-alone script. */
  const body = document.querySelector('body');
  const existingTextManips = document.querySelector('body > div.josh-text-manips');
  const joshTextManips = existingTextManips || document.createElement('div');
  joshTextManips.className = 'josh-text-manips';
  const textEffectButton = document.createElement('button');
  textEffectButton.innerText = buttonText;

  const addTextEffect = function addTextEffect({ target }) {
    const e = target;
    body.removeEventListener('mousedown', addTextEffect);

    const singleLetterSpans = e.textContent.split('').map((c) => {
      const singleLetterSpan = document.createElement('span');
      singleLetterSpan.textContent = c;
      return singleLetterSpan;
    });

    e.textContent = '';
    singleLetterSpans.forEach((span) => e.appendChild(span));

    const textEffectMouseover = ({ target: mouseoverTarget }) => {
      if (mouseoverTarget.tagName === 'SPAN') {
        mouseoverTarget.classList.add('selected');
      }
    };

    e.addEventListener('mouseover', textEffectMouseover);

    const textEffectMouseup = () => {
      e.removeEventListener('mouseup', textEffectMouseup);
      e.removeEventListener('mouseover', textEffectMouseover);
      const text = e.textContent;
      const classNames = [...e.childNodes].map((node) => node.className);
      const selectionStart = classNames.indexOf('selected');
      const selectionEnd = classNames.lastIndexOf('selected') + 1;

      e.innerHTML = '';
      e.appendChild(new Text(text.slice(0, selectionStart)));
      const effectSpan = document.createElement('span');
      effectSpan.className = effectClassName;
      effectSpan.appendChild(new Text(text.slice(selectionStart, selectionEnd)));
      e.appendChild(effectSpan);
      e.appendChild(new Text(text.slice(selectionEnd)));

      applyTextEffect(e.querySelector(`span.${effectClassName}`));
      textEffectButton.removeAttribute('disabled');
    };

    e.addEventListener('mouseup', textEffectMouseup);
  };

  textEffectButton.addEventListener('click', () => {
    textEffectButton.setAttribute('disabled', true);
    body.addEventListener('mousedown', addTextEffect);
  });

  joshTextManips.appendChild(textEffectButton);
  if (!existingTextManips) {
    body.appendChild(joshTextManips);
  }

  document.styleSheets[0].insertRule('.josh-text-manips {position: fixed;background-color: lightgrey;padding: 5px 10px;top: 62px;right: 10px;border-radius: 16px;box-shadow: 2px 2px 1px black;}');
}());
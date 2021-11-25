// ==UserScript==
// @name         Rainbowify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  apply rainbow colors to the text you select
// @author       Josh Parker
// @match        https://www.washingtonpost.com/*
// @match        https://www.google.com/*
// @match        https://en.wikipedia.org/wiki/*
// @match        https://www.tampermonkey.net/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

(function userScript() {
  /* this function is required for the style-based effects, such as rainbow, wave, and zany.
     it isn't needed for the text-based effects, such as sarcastic and zalgo */
  const addSingleLetterSpanTextEffect = function addSingleLetterSpanTextEffect(element, effect) {
    const e = element;
    const elementLength = e.textContent.length;
    const singleLetterSpans = e.textContent.split('').map((c, i) => {
      const singleLetterSpan = document.createElement('span');
      singleLetterSpan.textContent = c;
      effect(singleLetterSpan, i, elementLength);
      return singleLetterSpan;
    });

    e.textContent = '';
    singleLetterSpans.forEach((span) => e.appendChild(span));
  };

  /* This section is unique to the rainbow effect */
  const buttonText = 'rainbowify';
  const effectClassName = 'rainbow-text';
  const textEffect = function rainbowEffect(singleLetterSpan, i, elementLength) {
    singleLetterSpan.style.setProperty('color', `hsl(${(270 * i) / elementLength} 100% 50%)`);
  };
  const applyTextEffect = (element) => addSingleLetterSpanTextEffect(element, textEffect);

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
      const f = mouseoverTarget;
      if (f.tagName === 'SPAN') {
        f.className = 'selected';
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
      e.innerHTML = `${text.slice(0, selectionStart)}<span class='${effectClassName}'>${text.slice(selectionStart, selectionEnd)}</span>${text.slice(selectionEnd)}`;
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

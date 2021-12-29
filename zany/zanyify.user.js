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

(function zanifyUserScript() {
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

  /* This section is unique to the zany effect */
  const buttonText = 'zanyify';
  const effectClassName = 'zany-text';
  const textEffect = function zanyEffect(singleLetterSpan) {
    singleLetterSpan.style.setProperty('transform', `rotate(${Math.random() / 5 - 0.1}turn)`);
    singleLetterSpan.style.setProperty('display', 'inline-block');
    if (singleLetterSpan.textContent === ' ') {
      singleLetterSpan.style.setProperty('padding', '0 .25em');
    }
  };

  const applyTextEffect = function applyZanyEffect(element) {
    addSingleLetterSpanTextEffect(element, textEffect);
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
    const t = target;
    body.removeEventListener('mousedown', addTextEffect);

    const singleLetterSpans = t.textContent.split('').map((c) => {
      const singleLetterSpan = document.createElement('span');
      singleLetterSpan.textContent = c;
      return singleLetterSpan;
    });

    t.textContent = '';
    singleLetterSpans.forEach((span) => t.appendChild(span));

    const textEffectMouseover = ({ target: mouseoverTarget }) => {
      const mot = mouseoverTarget;
      if (mot.tagName === 'SPAN') {
        mot.className = 'selected';
      }
    };

    t.addEventListener('mouseover', textEffectMouseover);

    const textEffectMouseup = () => {
      t.removeEventListener('mouseup', textEffectMouseup);
      t.removeEventListener('mouseover', textEffectMouseover);
      const text = t.textContent;
      const classNames = [...t.childNodes].map((node) => node.className);
      const selectionStart = classNames.indexOf('selected');
      const selectionEnd = classNames.lastIndexOf('selected') + 1;

      t.innerHTML = '';
      t.appendChild(new Text(text.slice(0, selectionStart)));
      const effectSpan = document.createElement('span');
      effectSpan.className = effectClassName;
      effectSpan.appendChild(new Text(text.slice(selectionStart, selectionEnd)));
      t.appendChild(effectSpan);
      t.appendChild(new Text(text.slice(selectionEnd)));

      applyTextEffect(t.querySelector(`span.${effectClassName}`));
      textEffectButton.removeAttribute('disabled');
    };

    t.addEventListener('mouseup', textEffectMouseup);
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

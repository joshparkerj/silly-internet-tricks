// ==UserScript==
// @name         Highlightify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  highlight the text you select
// @author       Josh Parker
// @match        https://www.bls.gov/oes/*
// ==/UserScript==

(function highlightUserScript() {
  /* This section is unique to the highlight effect */
  const buttonText = 'highlightify';
  const effectClassName = 'highlighted-text';
  const textEffect = function highlightEffect(singleLetterSpan, i, length) {};

  const applyTextEffect = (element) => {
    document.styleSheets[0].insertRule('.highlighted-text { background-color: yellow; }');
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

  const addSingleLetterSpanTextEffect = function addSingleLetterSpanTextEffect(element, effect) {
    const elementLength = element.textContent.length;
    const singleLetterSpans = element.textContent.split('').map((c, i) => {
      const singleLetterSpan = document.createElement('span');
      singleLetterSpan.textContent = c;
      effect(singleLetterSpan, i, elementLength);
      return singleLetterSpan;
    });

    element.textContent = '';
    singleLetterSpans.forEach((span) => element.appendChild(span));
  };

  const addTextEffect = function addTextEffect({ target }) {
    body.removeEventListener('mousedown', addTextEffect);

    const singleLetterSpans = target.textContent.split('').map((c) => {
      const singleLetterSpan = document.createElement('span');
      singleLetterSpan.textContent = c;
      return singleLetterSpan;
    });

    target.textContent = '';
    singleLetterSpans.forEach((span) => target.appendChild(span));

    const textEffectMouseover = ({ target: mouseoverTarget }) => {
      if (mouseoverTarget.tagName === 'SPAN') {
        mouseoverTarget.classList.add('selected');
      }
    };

    target.addEventListener('mouseover', textEffectMouseover);

    const textEffectMouseup = () => {
      const e = target;
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

    target.addEventListener('mouseup', textEffectMouseup);
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

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

  const applyTextEffect = () => {
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

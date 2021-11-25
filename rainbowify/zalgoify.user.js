// ==UserScript==
// @name         Zalgoify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  zalgoize the text you select
// @author       Josh Parker
// @match        https://www.washingtonpost.com/*
// @match        https://www.google.com/*
// @match        https://en.wikipedia.org/wiki/*
// @match        https://www.tampermonkey.net/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

(function zalgoifyUserScript() {
  const body = document.querySelector('body');
  const existingTextManips = document.querySelector('body > div.josh-text-manips');
  const joshTextManips = existingTextManips || document.createElement('div');
  joshTextManips.className = 'josh-text-manips';
  const zalgoifyButton = document.createElement('button');
  zalgoifyButton.innerText = 'zalgoify';

  // zalgo chars from https://codepen.io/aranromperson/pen/OgOJzX
  const zalgoChars = ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̉', '̾', '͆', '̚', '̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͚', '̣', '̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͏', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡', '҉'];

  const changeTextToZalgoText = function changeTextToZalgoText(element) {
    const e = element;
    const randZalg = () => zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
    const randZalgs = () => [0, 1, 2, 3, 4].map(() => randZalg());
    e.textContent = e.textContent.split('').map((c) => c + randZalgs().join('')).join('');
  };

  const zalgoify = function zalgoify({ target }) {
    body.removeEventListener('mousedown', zalgoify);

    const singleLetterSpans = target.textContent.split('').map((c) => {
      const singleLetterSpan = document.createElement('span');
      singleLetterSpan.textContent = c;
      return singleLetterSpan;
    });

    target.textContent = '';
    singleLetterSpans.forEach((span) => target.appendChild(span));

    const zalgoifyMouseover = ({ target: mouseoverTarget }) => {
      if (mouseoverTarget.tagName === 'SPAN') {
        mouseoverTarget.className = 'selected';
      }
    };

    target.addEventListener('mouseover', zalgoifyMouseover);

    const zalgoifyMouseup = () => {
      target.removeEventListener('mouseup', zalgoifyMouseup);
      target.removeEventListener('mouseover', zalgoifyMouseover);
      const text = target.textContent;
      const classNames = [...target.childNodes].map((node) => node.className);
      const selectionStart = classNames.indexOf('selected');
      const selectionEnd = classNames.lastIndexOf('selected') + 1;
      target.innerHTML = `${text.slice(0, selectionStart)}<span class='zalgo-text'>${text.slice(selectionStart, selectionEnd)}</span>${text.slice(selectionEnd)}`;
      changeTextToZalgoText(target.querySelector('span.zalgo-text'));
      zalgoifyButton.removeAttribute('disabled');
    };

    target.addEventListener('mouseup', zalgoifyMouseup);
  };

  zalgoifyButton.addEventListener('click', () => {
    zalgoifyButton.setAttribute('disabled', true);
    body.addEventListener('mousedown', zalgoify);
  });

  joshTextManips.appendChild(zalgoifyButton);
  if (!existingTextManips) {
    body.appendChild(joshTextManips);
  }

  document.styleSheets[0].insertRule('.josh-text-manips {position: fixed;background-color: lightgrey;padding: 5px 10px;top: 62px;right: 10px;border-radius: 16px;box-shadow: 2px 2px 1px black;}');
}());

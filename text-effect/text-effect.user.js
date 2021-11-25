// ==UserScript==
// @name         text effect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a variety of text effects just for fun.
// @author       Josh Parker
// @match        https://www.theatlantic.com/*
// @match        https://www.washingtonpost.com/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

(function textEffectUserScript() {
  const effectify = function effectify(buttonText, effectClassName, applyTextEffect) {
    const textEffectButton = document.createElement('button');
    textEffectButton.innerText = buttonText;
    const body = document.querySelector('body');

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
        if (mouseoverTarget.tagName === 'SPAN') {
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

    return textEffectButton;
  };

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

  const addCSSRule = function addCSSRule(rule) {
    const style = document.createElement('style');
    style.textContent = rule;
    document.querySelector('head').appendChild(style);
  };

  const joshTextManips = document.createElement('div');
  joshTextManips.id = 'josh-text-manips';

  const rainbowEffect = function rainbowEffect(singleLetterSpan, i, elementLength) {
    singleLetterSpan.style.setProperty('color', `hsl(${(270 * i) / elementLength} 100% 50%)`);
  };

  const rainbowifyButton = effectify('rainbowify', 'rainbow-text', (element) => addSingleLetterSpanTextEffect(element, rainbowEffect));
  joshTextManips.appendChild(rainbowifyButton);

  const sarcastifyButton = effectify('sarcastify', 'sarcastic-text', (element) => {
    const e = element;
    const sarcasticCase = function sarcasticCase(char, i) {
      if (i % 2) {
        return char.toLocaleLowerCase();
      }

      return char.toLocaleUpperCase();
    };

    e.textContent = e.textContent.split('').map(sarcasticCase).join('');
  });

  joshTextManips.appendChild(sarcastifyButton);

  const waveEffect = function waveEffect(singleLetterSpan, i, length) {
    singleLetterSpan.classList.add('josh-wave');
    singleLetterSpan.style.setProperty('animation-delay', `${(i / length) * 3000}ms`);
    if (singleLetterSpan.textContent === ' ') {
      singleLetterSpan.style.setProperty('padding', '0 .25em');
    }
  };

  const wavifyButton = effectify('wavify', 'wave-text', (element) => {
    addCSSRule('@keyframes wave {from {transform: translateY(0);} 25% {transform: translateY(-100%);} 50% {transform: translateY(0);} to {transform: translateY(0);}}');
    addCSSRule('span.josh-wave {animation-duration: 3s; animation-name: wave; animation-iteration-count: infinite; display: inline-block;}');
    addSingleLetterSpanTextEffect(element, waveEffect);
  });

  joshTextManips.appendChild(wavifyButton);

  // zalgo chars from https://codepen.io/aranromperson/pen/OgOJzX
  const zalgoChars = ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̉', '̾', '͆', '̚', '̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͚', '̣', '̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͏', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡', '҉'];

  const zalgoifyButton = effectify('zalgoify', 'zalgo-text', (element) => {
    const e = element;
    const randZalg = () => zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
    const randZalgs = () => [0, 1, 2, 3, 4].map(() => randZalg());
    e.textContent = e.textContent.split('').map((c) => c + randZalgs().join('')).join('');
  });

  joshTextManips.appendChild(zalgoifyButton);

  const zanyEffect = function zanyEffect(singleLetterSpan) {
    singleLetterSpan.style.setProperty('transform', `rotate(${Math.random() / 5 - 0.1}turn)`);
    singleLetterSpan.style.setProperty('display', 'inline-block');
    if (singleLetterSpan.textContent === ' ') {
      singleLetterSpan.style.setProperty('padding', '0 .25em');
    }
  };

  const zanyifyButton = effectify('zanyify', 'zany-text', (element) => addSingleLetterSpanTextEffect(element, zanyEffect));
  joshTextManips.appendChild(zanyifyButton);

  // const fidgetifyButton = effectify('fidgetify', 'fidget-text', )
  /* const blinkifyButton = effectify('blinkify', 'blink-text', (element) => {

  }) */

  addCSSRule('body > div#josh-text-manips { position: fixed; background-color: lightgrey; padding: 5px 10px; top: 62px; right: 10px; border-radius: 16px; box-shadow: 2px 2px 1px black; z-index: 2; display: grid; grid-template-columns: 1fr 1fr 1fr; }');
  addCSSRule('body > div#josh-text-manips > button { grid-column: span 1; }');
  document.querySelector('body').appendChild(joshTextManips);
}());

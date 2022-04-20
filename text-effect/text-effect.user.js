// ==UserScript==
// @name         text effect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a variety of text effects just for fun.
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/text-effect/text-effect.user.js
// @downloadURL  https://gist.github.com/joshparkerj/62d580a9039115b4ab73f8588e48a2b3/raw/text-effect.user.js
// @updateURL    https://gist.github.com/joshparkerj/62d580a9039115b4ab73f8588e48a2b3/raw/text-effect.meta.js
// @match        https://www.theatlantic.com/*
// @match        https://www.washingtonpost.com/*
// @match        https://www.bls.gov/oes/*
// @match        https://www.ncbi.nlm.nih.gov/pmc/articles/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

import effectify from './effectify';
import addSingleLetterSpanTextEffect from './add-single-letter-span-text-effect';
import addCSSRule from './add-css-rule';
import rainbowEffect from './rainbow-effect';
import sarcasticEffect from './sarcastic-effect';
import applyWaveEffect from './apply-wave-effect';
import zalgoEffect from './zalgo-effect';
import zanyEffect from './zany-effect';

(function textEffectUserScript() {
  const joshTextManips = document.createElement('div');
  joshTextManips.id = 'josh-text-manips';

  const rainbowifyButton = effectify('rainbowify', 'rainbow-text', (element) => addSingleLetterSpanTextEffect(element, rainbowEffect));
  joshTextManips.appendChild(rainbowifyButton);

  const sarcastifyButton = effectify('sarcastify', 'sarcastic-text', sarcasticEffect);

  joshTextManips.appendChild(sarcastifyButton);

  const wavifyButton = effectify('wavify', 'wave-text', applyWaveEffect);

  joshTextManips.appendChild(wavifyButton);

  const zalgoifyButton = effectify('zalgoify', 'zalgo-text', zalgoEffect);

  joshTextManips.appendChild(zalgoifyButton);

  const zanyifyButton = effectify('zanyify', 'zany-text', (element) => addSingleLetterSpanTextEffect(element, zanyEffect));
  joshTextManips.appendChild(zanyifyButton);

  const fidgetEffect = function fidgetEffect(singleLetterSpan) {
    singleLetterSpan.setAttribute('style', `animation-duration: ${4.8 + Math.random() * 14.4}s; animation-delay: ${Math.random() * 4.8}s;`);
    if (singleLetterSpan.textContent === ' ') {
      singleLetterSpan.style.setProperty('padding', '0 .25em');
    }
  };

  const fidgetifyButton = effectify('fidgetify', 'fidget-text', (element) => {
    addCSSRule('@keyframes fidget {from {transform: rotate(0);} 10% {transform: rotate(360deg);} to {transform: rotate(360deg);}}');
    addCSSRule('.fidget-text > span {animation-name: fidget; animation-iteration-count: infinite; display: inline-block;}');
    addSingleLetterSpanTextEffect(element, fidgetEffect);
  });

  joshTextManips.appendChild(fidgetifyButton);

  addCSSRule('body > div#josh-text-manips { position: fixed; background-color: lightgrey; padding: 5px 10px; top: 62px; right: 10px; border-radius: 16px; box-shadow: 2px 2px 1px black; z-index: 2; display: grid; grid-template-columns: 1fr 1fr 1fr; }');
  addCSSRule('body > div#josh-text-manips > button { grid-column: span 1; }');
  document.querySelector('body').appendChild(joshTextManips);
}());

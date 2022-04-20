// ==UserScript==
// @name         Rainbowify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  apply rainbow colors to the text you select
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/text-effect/rainbowify.user.js
// @downloadURL  https://gist.github.com/joshparkerj/828b900e349e8781de9f45bd22c459e3/raw/rainbowify.user.js
// @updateURL    https://gist.github.com/joshparkerj/828b900e349e8781de9f45bd22c459e3/raw/rainbowify.meta.js
// @match        https://www.washingtonpost.com/*
// @match        https://www.google.com/*
// @match        https://en.wikipedia.org/wiki/*
// @match        https://www.tampermonkey.net/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

import addSingleLetterSpanTextEffect from './add-single-letter-span-text-effect';
import standAloneTextEffect from './stand-alone-text-effect';
import rainbowEffect from './rainbow-effect';

(function rainbowify() {
  standAloneTextEffect('rainbowify', 'rainbow-text', (element) => addSingleLetterSpanTextEffect(element, rainbowEffect));
}());

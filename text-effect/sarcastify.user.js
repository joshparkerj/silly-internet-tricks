// ==UserScript==
// @name         Sarcastify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  apply sarcastic capitalization to the text you select
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/text-effect/sarcastify.user.js
// @downloadURL  https://gist.github.com/joshparkerj/1be6e2fc1e4f486e684f6a5b0fb25207/raw/sarcastify.user.js
// @updateURL    https://gist.github.com/joshparkerj/1be6e2fc1e4f486e684f6a5b0fb25207/raw/sarcastify.meta.js
// @match        https://www.washingtonpost.com/*
// @match        https://www.google.com/*
// @match        https://en.wikipedia.org/wiki/*
// @match        https://www.tampermonkey.net/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

import standAloneTextEffect from './stand-alone-text-effect';
import sarcasticEffect from './sarcastic-effect';

(function sarcastifyUserScript() {
  standAloneTextEffect('sarcastify', 'sarcastic-text', sarcasticEffect);
}());

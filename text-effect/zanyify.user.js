// ==UserScript==
// @name         Zanyify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  twist the text for a zany effect
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/text-effect/zanyify.user.js
// @downloadURL  https://gist.github.com/joshparkerj/8d52e155cf7adf7f66bec7d6fa94838a/raw/zanyify.user.js
// @updateURL    https://gist.github.com/joshparkerj/8d52e155cf7adf7f66bec7d6fa94838a/raw/zanyify.meta.js
// @match        https://www.washingtonpost.com/*
// @match        https://www.google.com/*
// @match        https://en.wikipedia.org/wiki/*
// @match        https://www.tampermonkey.net/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

import addSingleLetterSpanTextEffect from './add-single-letter-span-text-effect';
import standAloneTextEffect from './stand-alone-text-effect';
import zanyEffect from './zany-effect';

(function zanifyUserScript() {
 standAloneTextEffect('zanyify', 'zany-text', (e) => addSingleLetterSpanTextEffect(e, zanyEffect));
}());

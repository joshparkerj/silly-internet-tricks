// ==UserScript==
// @name         Zalgoify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  zalgoize the text you select
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/text-effect/zalgoify.user.js
// @downloadURL  https://gist.github.com/joshparkerj/beec777ee27ec85d43dcca99f7019a5e/raw/zalgoify.user.js
// @updateURL    https://gist.github.com/joshparkerj/beec777ee27ec85d43dcca99f7019a5e/raw/zalgoify.meta.js
// @match        https://www.washingtonpost.com/*
// @match        https://www.google.com/*
// @match        https://en.wikipedia.org/wiki/*
// @match        https://www.tampermonkey.net/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

import standAloneTextEffect from './stand-alone-text-effect';
import zalgoEffect from './zalgo-effect';

(function zalgoify() {
 standAloneTextEffect('zalgoify', 'zalgo-text', zalgoEffect);
}());

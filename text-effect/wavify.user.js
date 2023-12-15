// ==UserScript==
// @name         Wavify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add an animated wave effect to the text you select
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/text-effect/wavify.user.js
// @downloadURL  https://gist.github.com/joshparkerj/a5981c6666b46bb0d51443608208d684/raw/wavify.user.js
// @updateURL    https://gist.github.com/joshparkerj/a5981c6666b46bb0d51443608208d684/raw/wavify.meta.js
// @match        https://www.washingtonpost.com/*
// @match        https://www.google.com/*
// @match        https://en.wikipedia.org/wiki/*
// @match        https://www.tampermonkey.net/*
// @match        https://slate.com/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

import standAloneTextEffect from './stand-alone-text-effect';
import applyWaveEffect from './apply-wave-effect';

(function wavify() {
 standAloneTextEffect('wavify', 'wave-text', applyWaveEffect);
}());

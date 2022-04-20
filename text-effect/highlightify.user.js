// ==UserScript==
// @name         Highlightify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  highlight the text you select
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/text-effect/highlightify.user.js
// @downloadURL  https://gist.github.com/joshparkerj/c57b5d96eb5ea00886ec132424a0dc4e/raw/highlightify.user.js
// @updateURL    https://gist.github.com/joshparkerj/c57b5d96eb5ea00886ec132424a0dc4e/raw/highlightify.meta.js
// @match        https://www.bls.gov/oes/*
// ==/UserScript==

import standAloneTextEffect from './stand-alone-text-effect';

(function highlightUserScript() {
  standAloneTextEffect('highlightify', 'highlighted-text', () => { document.styleSheets[0].insertRule('.highlighted-text { background-color: yellow; }'); });
}());

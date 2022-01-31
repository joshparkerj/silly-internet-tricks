// ==UserScript==
// @name         Dordle Sploits
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cheating
// @author       Josh Parker
// @match        https://zaratustra.itch.io/dordle
// @icon         https://www.google.com/s2/favicons?domain=itch.io
// @grant        none
// @require      https://d2t3dun0il9ood.cloudfront.net/dictionary.js
// ==/UserScript==

(function sploits() {
  const dict = [];
  const getWords = (trie, prefix = '') => {
    if (!trie) {
      dict.push(prefix);
    } else {
      Object.keys(trie).forEach((c) => getWords(trie[c], prefix + c));
    }
  };

  getWords(validWordTrie);
}());

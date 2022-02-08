// ==UserScript==
// @name         Dordle Sploits
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cheating
// @author       Josh Parker
// @match        *://v6p9d9t4.ssl.hwcdn.net/html/5162977/index.html
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

  // eslint-disable-next-line no-undef
  getWords(validWordTrie);
  const hasLetters = (word, letters) => [...letters].every((letter) => word.includes(letter));
  const allOf = (letters) => (word) => hasLetters(word, letters);

  const noLetters = (word, letters) => [...letters].every((letter) => !word.includes(letter));
  const noneOf = (letters) => (word) => noLetters(word, letters);

  const matches = (re) => {
    const pat = new RegExp(`^${re}$`);
    return (word) => word.match(pat);
  };

  const wordle = (wordList, includes, excludes, re) => (
    wordList.filter(allOf(includes)).filter(noneOf(excludes)).filter(matches(re))
  );

  const letterCounts = {};
  const abc = 'abcdefghijklmnopqrstuvwxyz';
  [...abc].forEach((c) => { letterCounts[c] = [0,0,0,0,0]; });
  const score = (w) => [...w].reduce((acc, c, i) => acc + letterCounts[c][i], 0);

  const allFives = dict.filter((w) => w.length === 5).sort((a, b) => score(b) - score(a));
  const fives = allFives.filter((w) => (new Set(w)).size === 5);
  
  fives.forEach((w) => [...w].forEach((c, i) => { letterCounts[c][i] += 1; }));
  
  const leftGuesses = document.querySelector('#game td:nth-child(1) .table_guesses tbody');
  const rightGuesses = document.querySelector('#game td:nth-child(2) .table_guesses tbody');
  const leftOptions = document.createElement('ol');
  const rightOptions = document.createElement('ol');

  const getIncludes = (tbody) => {
    const includes = [];
    tbody.querySelectorAll('td').forEach((td) => {
      const color = td.
    });

    return includes.join('');
  };

  document.querySelector('body').addEventListener('keypress', ({ code }) => {
    if (code === 'Enter') {
      
    }
  });
}());

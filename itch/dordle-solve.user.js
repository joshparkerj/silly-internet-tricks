/* eslint-disable prefer-regex-literals */
// ==UserScript==
// @name         Dordle Solve
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This time, we'll suggest exactly one word at a time and see if we always win
// @author       Josh Parker
// @match        *://v6p9d9t4.ssl.hwcdn.net/html/*/index.html
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
  const hasLetters = (word, letters) => letters.every((letter) => word.includes(letter));
  const allOf = (letters) => (word) => hasLetters(word, letters);

  const noLetters = (word, letters) => letters.every((letter) => !word.includes(letter));
  const noneOf = (letters) => (word) => noLetters(word, letters);

  const matches = (re) => {
    const pat = new RegExp(`^${re}$`);
    return (word) => word.match(pat);
  };

  const wordle = (wordList, includes, excludes, re) => (
    wordList.filter(allOf(includes)).filter(noneOf(excludes)).filter(matches(re))
  );

  const allFives = dict.filter((w) => w.length === 5);
  allFives.push('inbox');

  const leftGuesses = document.querySelector('#game td:nth-child(1) .table_guesses tbody');
  const rightGuesses = document.querySelector('#game td:nth-child(2) .table_guesses tbody');
  const nextMove = document.createElement('p');
  nextMove.id = 'next-move';

  const getStatus = (td) => td.style.getPropertyValue('background-color');

  const getIncludes = (tbody) => {
    const includes = [];
    let excludes = [];
    const regExpItems = ['.', '.', '.', '.', '.'];
    const anythingBut = (letter, i) => {
      if (regExpItems[i] === '.') {
        regExpItems[i] = `[^${letter}`;
      } else if (regExpItems[i].startsWith('[')) {
        regExpItems[i] += letter;
      }
    };

    tbody.querySelectorAll('td').forEach((td, index) => {
      const tdStatus = getStatus(td);

      const letter = td.textContent.toLocaleLowerCase();
      const i = index % 5;

      if (tdStatus === 'var(--ok-color)') {
        includes.push(letter);
        excludes = excludes.filter((c) => c !== letter);
        regExpItems[i] = letter;
      } else if (tdStatus === 'var(--near-color)') {
        includes.push(letter);
        excludes = excludes.filter((c) => c !== letter);
        anythingBut(letter, i);
      } else if (tdStatus === 'var(--bg-color)' && letter) {
        if (!includes.includes(letter)) {
          excludes.push(letter);
        } else {
          anythingBut(letter, i);
        }
      }
    });

    const regExp = regExpItems.map((item) => (item.startsWith('[') ? `${item}]` : item)).join('');

    return wordle(allFives, includes, excludes, regExp);
  };

  const matchCount = (word, letters) => {
    const wordSet = new Set(word);
    return [...wordSet].reduce((acc, e) => (letters.has(e) ? acc + 1 : acc), 0);
  };

  const mostMatched = (words, letters) => {
    const sortable = words.slice();
    return sortable.sort((a, b) => matchCount(b, letters) - matchCount(a, letters));
  };

  const foundLetters = (words) => (
    words.reduce((acc, word) => [...word].filter((c) => acc.includes(c)), [...words[0]])
  );

  const possibleLetters = (words) => {
    const letterSet = new Set(words.join(''));
    const fl = foundLetters(words);
    fl.forEach((c) => letterSet.delete(c));
    return letterSet;
  };

  const suggestions = (words, sugDict = allFives) => {
    const pl = possibleLetters(words);
    const mm = mostMatched(sugDict, pl);
    return mm.filter((w) => matchCount(w, pl) === matchCount(mm[0], pl));
  };

  const twoSuggestions = (longWordList, shortWordList) => {
    const longSuggs = suggestions(longWordList);
    return suggestions(shortWordList, longSuggs);
  };

  const score = (counts) => (w) => [...w].reduce((acc, c, i) => acc + counts[c][i], 0);
  const scoreSorter = (counts) => {
    const scoreCounts = score(counts);
    return (a, b) => scoreCounts(b) - scoreCounts(a);
  };

  const abc = 'abcdefghijklmnopqrstuvwxyz';

  document.querySelector('body').addEventListener('keypress', ({ code }) => {
    if (code === 'Enter') {
      nextMove.textContent = '';
      const leftIncludes = getIncludes(leftGuesses);
      if (leftIncludes.length === 1) {
        nextMove.appendChild(new Text(`${leftIncludes[0]}, `));
      }

      const rightIncludes = getIncludes(rightGuesses);
      if (rightIncludes.length === 1) {
        nextMove.appendChild(new Text(`${rightIncludes[0]}, `));
      }

      let longWordList;
      let shortWordList;
      if (leftIncludes.length > rightIncludes.length) {
        longWordList = leftIncludes;
        shortWordList = rightIncludes;
      } else {
        longWordList = rightIncludes;
        shortWordList = leftIncludes;
      }

      const letterCounts = {};
      [...abc].forEach((c) => { letterCounts[c] = [0, 0, 0, 0, 0]; });

      const wordList = longWordList.concat(shortWordList);
      wordList.forEach((w) => {
        [...w].forEach((c, i) => { letterCounts[c][i] += 1; });
      });

      const suggs = twoSuggestions(longWordList, shortWordList);
      suggs.sort(scoreSorter(letterCounts));

      nextMove.appendChild(new Text(suggs[0]));
    }
  });

  const css = `
body > p#next-move {
  max-width: 400px;
  margin-left: 70px;
  position: relative;
  top: -12px;
  font-size: .8em;
}
`;

  const style = document.createElement('style');
  style.appendChild(new Text(css));
  const body = document.querySelector('body');
  body.appendChild(style);
  body.appendChild(nextMove);
}());

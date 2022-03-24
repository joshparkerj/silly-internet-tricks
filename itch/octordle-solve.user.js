/* eslint-disable prefer-regex-literals */
// ==UserScript==
// @name         Octordle Cheats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to autosolve octordle
// @author       Josh Parker
// @match        https://octordle.com/?mode=free
// @icon         https://www.google.com/s2/favicons?sz=64&domain=octordle.com
// @grant        none
// @require      https://d2t3dun0il9ood.cloudfront.net/dictionary.js
// ==/UserScript==

(function octordleCheats() {
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

  const guesses = [...document.querySelectorAll('#game div[id$=container][style*=block] table.table_guesses')];

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

      if (tdStatus === 'rgb(0, 204, 136)') {
        includes.push(letter);
        excludes = excludes.filter((c) => c !== letter);
        regExpItems[i] = letter;
      } else if (tdStatus === 'rgb(255, 204, 0)') {
        includes.push(letter);
        excludes = excludes.filter((c) => c !== letter);
        anythingBut(letter, i);
      } else if (tdStatus === 'rgb(24, 26, 27)' && letter) {
        if (!includes.includes(letter)) {
          excludes.push(letter);
        } else {
          anythingBut(letter, i);
        }
      }
    });

    const regExp = regExpItems.map((item) => (item.startsWith('[') ? `${item}]` : item)).join('');

    const result = wordle(allFives, includes, excludes, regExp);
    return result;
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

  const manySuggestions = (wordLists, curatedDict) => {
    wordLists.sort((a, b) => b.length - a.length);
    return wordLists.reduce((suggs, wordList) => suggestions(wordList, suggs), curatedDict);
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
      const wordLists = [];
      guesses.forEach((guessTable) => {
        const includes = getIncludes(guessTable);
        if (includes.length === 1) {
          nextMove.appendChild(new Text(`${includes[0]}, `));
        } else {
          wordLists.push(includes);
        }
      });

      const letterCounts = {};
      [...abc].forEach((c) => { letterCounts[c] = [0, 0, 0, 0, 0]; });

      const wordList = wordLists.reduce((acc, e) => acc.concat(e));
      wordList.forEach((w) => {
        [...w].forEach((c, i) => { letterCounts[c][i] += 1; });
      });

      const wordListSet = new Set(wordList);
      const whiteSpace = new RegExp('\\s+', 'g');
      const alreadyGuessed = [...document.querySelectorAll('#game div[id$=container][style*=block] table.table_guesses')].map((table) => [...table.querySelectorAll('tr')].map((e) => e.textContent?.replace(whiteSpace, '').toLocaleLowerCase()).filter((w) => w?.length === 5)).flat();

      alreadyGuessed.forEach((word) => wordListSet.delete(word));

      const suggs = manySuggestions(wordLists, [...wordListSet]);
      suggs.sort(scoreSorter(letterCounts));

      nextMove.appendChild(new Text(suggs[0]));
    }
  });

  const css = `
body > p#next-move {
  max-width: 400px;
  margin-left: 70px;
  position: relative;
  top: -250px;
  font-size: 1.8em;
}
`;

  const style = document.createElement('style');
  style.appendChild(new Text(css));
  const body = document.querySelector('body');
  body.appendChild(style);
  body.appendChild(nextMove);
}());

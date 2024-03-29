/* eslint-disable prefer-regex-literals */
// ==UserScript==
// @name         Dordle Sploits
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cheating
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

 const letterCounts = {};
 const thirdLetterCounts = {};
 const secondLetterCounts = {};
 const firstLetterCounts = {};
 const abc = 'abcdefghijklmnopqrstuvwxyz';
 [...abc].forEach((c) => {
  letterCounts[c] = [0, 0, 0, 0, 0];
  thirdLetterCounts[c] = [0, 0, 0, 0, 0];
  secondLetterCounts[c] = [0, 0, 0, 0, 0];
  firstLetterCounts[c] = [0, 0, 0, 0, 0];
 });

 const score = (counts) => (w) => [...w].reduce((acc, c, i) => acc + counts[c][i], 0);

 const allFives = dict.filter((w) => w.length === 5);
 allFives.push('inbox');
 const fives = allFives.filter((w) => new Set(w).size === 5);
 const second = fives.filter((w) => !w.endsWith('s'));
 const first = second.filter((w) => !w.endsWith('d') && !w.endsWith('y'));

 allFives.forEach((w) => [...w].forEach((c, i) => {
  letterCounts[c][i] += 1;
 }));
 fives.forEach((w) => [...w].forEach((c, i) => {
  thirdLetterCounts[c][i] += 1;
 }));
 second.forEach((w) => [...w].forEach((c, i) => {
  secondLetterCounts[c][i] += 1;
 }));
 first.forEach((w) => [...w].forEach((c, i) => {
  firstLetterCounts[c][i] += 1;
 }));

 const scoreSorter = (counts) => {
  const scoreCounts = score(counts);
  return (a, b) => scoreCounts(b) - scoreCounts(a);
 };

 const allFivesSorted = allFives.sort(scoreSorter(letterCounts));
 const fivesSorted = fives.sort(scoreSorter(thirdLetterCounts));
 const secondSorted = second.sort(scoreSorter(secondLetterCounts));
 const firstSorted = first.sort(scoreSorter(firstLetterCounts));

 const leftGuesses = document.querySelector('#game td:nth-child(1) .table_guesses tbody');
 const rightGuesses = document.querySelector('#game td:nth-child(2) .table_guesses tbody');
 const leftOptions = document.createElement('ol');
 leftOptions.id = 'left-options';
 const rightOptions = document.createElement('ol');
 rightOptions.id = 'right-options';
 const untriedOptions = document.createElement('p');
 untriedOptions.id = 'untried-options';

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

  let result = wordle(firstSorted, includes, excludes, regExp).slice(0, 26);
  if (result.length === 26) {
   return result;
  }

  result.push('-----');
  result = result
   .concat(wordle(secondSorted, includes, excludes, regExp).filter((w) => !result.includes(w)))
   .slice(0, 27);
  if (result.length === 27) {
   return result;
  }

  result.push('-----');
  result = result
   .concat(wordle(fivesSorted, includes, excludes, regExp).filter((w) => !result.includes(w)))
   .slice(0, 28);
  if (result.length === 28) {
   return result;
  }

  result.push('-----');
  return result
   .concat(wordle(allFivesSorted, includes, excludes, regExp).filter((w) => !result.includes(w)))
   .slice(0, 29);
 };

 document.querySelector('body').addEventListener('keypress', ({ code }) => {
  if (code === 'Enter') {
   const fillOptions = (options) => (w) => {
    if (w === '-----') {
     options.appendChild(document.createElement('hr'));
    } else {
     const li = document.createElement('li');
     li.appendChild(new Text(w));
     options.appendChild(li);
    }
   };

   leftOptions.innerHTML = '';
   rightOptions.innerHTML = '';
   const leftIncludes = getIncludes(leftGuesses);
   leftIncludes.forEach(fillOptions(leftOptions));
   const rightIncludes = getIncludes(rightGuesses);
   rightIncludes.forEach(fillOptions(rightOptions));
   const colorMatcher = new RegExp('var\\([^)]+\\)', 'g');
   const untriedLetters = [...'abcdefghijklmnopqrstuvwxyz'].filter((c) => {
    const td = document.querySelector(`#keyboard td#${c}`);
    const tdStyle = td.style;
    const tdBackgroundImage = tdStyle.getPropertyValue('background-image');
    const tdBackgroundImageMatches = tdBackgroundImage.match(colorMatcher);
    const everyMatch = tdBackgroundImageMatches.every((m) => m === 'var(--bg-color)');
    return everyMatch;
   });

   const untried = new RegExp(`^[${untriedLetters.join('')}]{5}$`);
   const untriedWords = fivesSorted.filter((w) => w.match(untried));

   untriedOptions.textContent = '';
   untriedOptions.appendChild(new Text(untriedWords.slice(0, 26).join(', ')));
  }
 });

 const css = `
body > ol#left-options,
body > ol#right-options {
  position: fixed;
  top: 10%;
}

body > ol#left-options {
  left: -2%;
}

body > ol#right-options {
  right: 5%;
}

body > p#untried-options {
  max-width: 400px;
  margin-left: 70px;
  position: relative;
  top: -12px;
  font-size: .8em;
}

body > div#body {
  margin-left: 64px;
}
`;

 const style = document.createElement('style');
 style.appendChild(new Text(css));
 const body = document.querySelector('body');
 body.appendChild(style);
 body.appendChild(leftOptions);
 body.appendChild(rightOptions);
 body.appendChild(untriedOptions);

 document.querySelector('body > div#body').style.setProperty('max-width', '400px');
}());

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
  const fives = allFives.filter((w) => (new Set(w)).size === 5);
  const second = fives.filter((w) => !w.endsWith('s'));
  const first = second.filter((w) => !w.endsWith('d') && !w.endsWith('y'));

  allFives.forEach((w) => [...w].forEach((c, i) => { letterCounts[c][i] += 1; }));
  fives.forEach((w) => [...w].forEach((c, i) => { thirdLetterCounts[c][i] += 1; }));
  second.forEach((w) => [...w].forEach((c, i) => { secondLetterCounts[c][i] += 1; }));
  first.forEach((w) => [...w].forEach((c, i) => { firstLetterCounts[c][i] += 1; }));

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
  // const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

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
    result = result.concat(
      wordle(secondSorted, includes, excludes, regExp)
        .filter((w) => !result.includes(w)),
    ).slice(0, 27);
    if (result.length === 27) {
      return result;
    }

    result.push('-----');

    result = result.concat(
      wordle(fivesSorted, includes, excludes, regExp)
        .filter((w) => !result.includes(w)),
    ).slice(0, 28);
    if (result.length === 28) {
      return result;
    }

    result.push('-----');
    return result.concat(
      wordle(allFivesSorted, includes, excludes, regExp)
        .filter((w) => !result.includes(w)),
    ).slice(0, 29);
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
        const pl = possibleLetters(words.split(' '));
        const mm = mostMatched(sugDict, pl);
        return mm.filter((w) => matchCount(w, pl) === matchCount(mm[0], pl));
      };

      const twoSuggestions = (longWordList, shortWordList) => {
        const longSuggs = suggestions(longWordList);
        return suggestions(shortWordList, longSuggs);
      };

      // TODO: find words that can narrow down the few remaining uncertain letters when applicable
      // For example:
      // if the possible words are patch, match, latch, watch, natch, catch, and hatch
      // we should suggest a word that contains as many of p, m, l, w, and n as possible
      // (not necessarily c and h since those already appear to be accounted for)
      // this will narrow down the possible answers faster.
      // in this example, "clamp" would be a good suggestion since it contains p, m, and l
      // (plus the c in first position is useful in case the answer is catch)
      // Example two:
      // if the possible words are elint, fient, inlet, intel, and inept
      // we should suggest a word that contains as many of l, f, and p as possible
      // good suggestions include flaps, flips, flops, flump, pelfs, and pilaf
      // And one more example:
      // possible words: baler, paler, lager, layer, laver, laxer
      // suggested word should have b, p, g, y, v, x
      // I believe we'd have to settle for three of the six
      // bumpy might be a good suggestion,
      // since the b in first position might help in case it's baler
      // example four:
      // possible words: croup, cromb, crony, croon, crool
      // suggested word should have u, p, m, b, n, y, l
      // bumpy would be an excellent suggestion,
      // since all five letters come from the required letter list.
      // example five:
      // possible words:
      // shyer, shrew, syver, syker, strep, skyer, sprew, strew, shred, spred, seres,
      // serks, sered, serer, seder, sewer, sever, sheer, steer, speer, sweer, skeer
      // suggested word should have w, t, y, p, d, h, k, v
      // letters that appear most frequently among the possible words might be most valuable
      // w: 5, t: 3, y: 4, p: 4, d: 4, h: 4, k: 4, v: 2
      // I'd try pawky as an example suggestion
      // example six:
      // different situation.
      // Possible words on the left are upled and expel.
      // Possible words on the right are alter and alder.
      // suggested word should have u, x, t, d
      // perhaps exult?
      // example seven:
      // left words: swamp, spams, spaws, spaza, spasm, spazz
      // right words: minim, jinni
      // suggested word should have w, j, z, m
      // in this case, swamp would be a good suggested word
      // it contains w and m and I didn't find any word that contains more than 2 of the 4 letters.
      // example eight:
      // left words: spods, spook, spoof, swoop
      // right words: maiko, amigo, axiom, amido
      // suggested word should have w, d, f, g, k, x
      // k would be especially good since it's relevant on the left and right
      // good suggestions might include: gawks, gawky, gowks, kedge
      // simple example:
      // mealy, vealy, leavy, leafy
      // letters: m, v, f
      // suggestion: muffs
      // simple example:
      // pudge, mudge, fudge
      // letters: p, m, f
      // suggestion: frump
      // finally:
      // faver, faker, waver, waker, waxer, wafer
      // letters: w, f, k, x, v
      // suggestion: waver
      // again:
      // fugly, duply, bully, dully, gully, fully
      // letters: f, g, d, p, b
      // suggestion: fudge
      // again:
      // bravi, bajri, libra, hijra, liard, izard, laari, rabbi, ardri, aggri
      // letters: d, g, h, j, l, z, v, b
      // suggestion: lobed

      // TODO: double letters still don't always work correctly.
      // example: First guess SWELL
      // three greens: SW__L
      // suggestions include SWILL
      // definitely wrong
      // if there was an L in fourth position, it would have been yellow not gray)
      // needs fix
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

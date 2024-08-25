// ==UserScript==
// @name         Cheat on Words on Stream
// @namespace    http://tampermonkey.net/
// @version      2024-03-10
// @description  Pop out instant anagram solutions
// @author       Josh Parker
// @match        https://hryanjones.com/guess-my-word/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hryanjones.com
// @grant        none
// ==/UserScript==

(function cheatWos() {
 console.log('about to cheat');
 const fakeWords = new Set(JSON.parse(localStorage.getItem('wos-fake-words')));

 const abc = 'abcdefghijklmnopqrstuvwxyz';
 const pointValues = {
  a: 1,
  b: 3,
  c: 3,
  d: 2,
  e: 1,
  f: 4,
  g: 2,
  h: 4,
  i: 1,
  j: 8,
  k: 5,
  l: 1,
  m: 3,
  n: 1,
  o: 1,
  p: 3,
  q: 10,
  r: 1,
  s: 1,
  t: 1,
  u: 1,
  v: 4,
  w: 4,
  x: 8,
  y: 4,
  z: 10,
 };

 const score = (w) => [...w].reduce((acc, c) => acc + pointValues[c], 0);

 const makePrefixTree = (dictArray) => {
  const tree = {};

  const addChild = (node, c) => {
   if (!(c in node)) {
    // eslint-disable-next-line no-param-reassign
    node[c] = {};
   }

   return node[c];
  };

  dictArray.forEach((w) => {
   let node = tree;
   [...w].forEach((c) => {
    node = addChild(node, c);
   });

   // an empty string child signals the end of a valid word
   addChild(node, '');
  });

  return tree;
 };

 const abcObj = {};

 [...abc].forEach((c) => {
  abcObj[c] = 0;
 });

 const abcO = JSON.stringify(abcObj);

 const getEm = (scramble) => {
  const abcTemp = JSON.parse(abcO);
  [...scramble].forEach((c) => {
   abcTemp[c] += 1;
  });

  return abcTemp;
 };
 // eslint-disable-next-line no-undef
 const solve = (scramble, prefixTreeRoot = validWordTrie) => {
  const abcObjMem = getEm(scramble);

  const solutions = [];

  const solveHelper = (prefixTreeNode, prefix = '') => {
   if (prefixTreeNode === '') return;

   if ('' in prefixTreeNode) solutions.push(prefix);

   Object.keys(prefixTreeNode).forEach((letter) => {
    if (abcObjMem[letter] > 0) {
     abcObjMem[letter] -= 1;

     solveHelper(prefixTreeNode[letter], prefix + letter);

     abcObjMem[letter] += 1;
    }
   });
  };

  solveHelper(prefixTreeRoot);
  return solutions;
 };

 const fake = (scramble) => (
  [...scramble].map((_, i) => [...scramble].slice(0, i).concat([...scramble].slice(i + 1)))
 );

 // eslint-disable-next-line no-undef
 const solveFake = (scramble, prefixTreeRoot = validWordTrie) => {
  const preDict = makePrefixTree(solve(scramble, prefixTreeRoot));
  return fake(scramble).map((e) => (
   solve(e, preDict).sort((a, b) => score(b) - score(a))
  )).filter((solution) => solution[0]?.length === scramble.length - 1);
 };

 /* const solveHidden = (scramble) => (
  [...abc].map((c) => solveFake(scramble + c))
 );

 const solveAndFilterHidden = (scramble, targetCount) => {
  const solutions = solveHidden(scramble);
  const sufficientSolutions = solutions.flat().filter((solution) => solution.length >= targetCount);
  const dupes = new Set();

  const dedupedSolutions = sufficientSolutions.filter((solution) => solution.every((word) => {
   const seen = dupes.has(word);
   dupes.add(word);
   return !seen;
  }));

  return dedupedSolutions;
 };

 const solveAndDisplayHidden = (scramble, targetCount, otherTargets) => {
  const dedupedSolutions = solveAndFilterHidden(scramble, targetCount);
  const fullSolutions = dedupedSolutions.map((solution) => (
   otherTargets.map((target) => (
    solve(solution[0], target[0])
   )).concat(solution)
  )).filter((solution) => (
   solution.every((otherSolution, i) => (
    (i >= otherTargets.length)
    || (otherSolution.length >= otherTargets[i][1])
   ))
  ));

  const displaySolutions = fullSolutions.map((solution) => (
   solution.flat().map((word) => `${word} ${score(word)}`).join(' ')
  ));

  return displaySolutions.sort((a, b) => a.length - b.length);
 };

 const display = (solutions) => (
  JSON.stringify(solutions.filter((w) => w.length > 3).map((w) => (
   `${w} ${score(w)}`
  )).sort((a, b) => (
   Number(b.match(/\d+/)) - Number(a.match(/\d+/))
  ))));

 const solveHiddenFakeX2 = (scramble) => {
  const doubleFakes = new Set(fake(scramble).map((faked) => fake(faked)).flat());
  return [...doubleFakes].map((e) => [...abc].map((c) => solve(e + c)));
 };
*/
 // create the UI
 const wosMain = document.createElement('main');
 wosMain.id = 'wos';
 document.body.appendChild(wosMain);

 let gameModeGlobal = 'no-fake-no-hidden';
 const gameModeHTML = `
<legend>Game Mode:</legend>
<input type="radio" id="game-mode-no-fake-no-hidden" name="game-mode" value="no-fake-no-hidden" checked />
<label for="game-mode-no-fake-no-hidden">No fake letters; no hidden letters</label>
<input type="radio" id="game-mode-one-fake-no-hidden" name="game-mode" value="one-fake-no-hidden" />
<label for="game-mode-one-fake-no-hidden">One fake letter; no hidden letters</label>
`;

 const gameModeFieldset = document.createElement('fieldset');
 gameModeFieldset.id = 'wos-game-mode';
 gameModeFieldset.addEventListener('change', ({ target: { value: gameMode } }) => {
  gameModeGlobal = gameMode;
 });

 let minimumWordLength = 4;
 const minimumWordLengthHTML = `
<legend>Minimum word length:</legend>
<input type="radio" id="minimum-word-length-4" name="minimum-word-length" value="4" checked />
<label for="minimum-word-length-4">4</label>
<input type="radio" id="minimum-word-length-5" name="minimum-word-length" value="5" />
<label for="minimum-word-length-5">5</label>
`;

 const wosForm = document.createElement('div');
 wosForm.id = 'wos';

 const minimumWordLengthFieldset = document.createElement('fieldset');
 minimumWordLengthFieldset.id = 'wos-minimum-word-length';
 minimumWordLengthFieldset.addEventListener('change', ({ target: { value: minWordLength } }) => {
  console.log(`set min word length to: ${minWordLength}`);
  minimumWordLength = minWordLength;
 });

 gameModeFieldset.innerHTML = gameModeHTML;
 wosForm.appendChild(gameModeFieldset);

 minimumWordLengthFieldset.innerHTML = minimumWordLengthHTML;
 wosForm.appendChild(minimumWordLengthFieldset);

 const solutionsSection = document.createElement('section');
 solutionsSection.id = 'wos-solutions-section';

 const displayWord = (parentElement) => (word) => {
  const solutionDiv = document.createElement('div');
  solutionDiv.appendChild(new Text(`${word} ${score(word)}`));
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = 'not-in-dictionary';
  checkbox.value = word;
  checkbox.id = `${checkbox.name}-${checkbox.value}`;
  solutionDiv.appendChild(checkbox);
  const checkboxLabel = document.createElement('label');
  checkboxLabel.for = checkbox.id;
  checkboxLabel.appendChild(new Text('not in dictionary'));
  solutionDiv.appendChild(checkboxLabel);
  parentElement.appendChild(solutionDiv);
 };

 const scrambleInput = document.createElement('input');
 scrambleInput.addEventListener('change', ({ target: { value: scramble } }) => {
  console.log(`got scramble: ${scramble}`);
  solutionsSection.innerHTML = '';

  if (gameModeGlobal === 'no-fake-no-hidden') {
   const solutions = document.createElement('div');
   solutions.classList.add('wos-solutions');
   solutionsSection.appendChild(solutions);
   solve(scramble)
    .filter((w) => w.length >= minimumWordLength)
    .filter((w) => !fakeWords.has(w))
    .sort((a, b) => a.length - b.length)
    .forEach(displayWord(solutions));
  } else if (gameModeGlobal === 'one-fake-no-hidden') {
   solveFake(scramble).forEach((solutionSet) => {
    const solutions = document.createElement('div');
    solutions.classList.add('wos-solutions');
    solutionsSection.appendChild(solutions);
    solutionSet.filter((w) => w.length >= minimumWordLength)
     .filter((w) => !fakeWords.has(w))
     .sort()
     .sort((a, b) => a.length - b.length)
     .forEach(displayWord(solutions));
   });
  }
 });

 wosForm.appendChild(scrambleInput);
 wosMain.appendChild(wosForm);
 wosMain.appendChild(solutionsSection);

 const style = document.createElement('style');
 style.appendChild(new Text(`
div.wos-solutions {
 display: flex;
 flex-direction: column;
 flex-wrap: wrap;
 height: 400px;
}

div.wos-solutions > div {
 border: solid black 1px;
 margin:  2px;
 padding: 4px;
 border-radius: 6px;
}
 `));

 wosMain.appendChild(style);

 const fakeWordButton = document.createElement('button');
 fakeWordButton.id = 'fake-word';
 fakeWordButton.appendChild(new Text('update dictionary'));
 fakeWordButton.addEventListener('click', () => {
  const words = [...document.querySelectorAll('input[type=checkbox')].filter((e) => e.checked).map((e) => e.value);
  words.forEach((word) => fakeWords.add(word));
  localStorage.setItem('wos-fake-words', JSON.stringify([...fakeWords]));
 });

 wosMain.appendChild(fakeWordButton);
}());

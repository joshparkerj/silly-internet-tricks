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
 q: 1,
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

const getDict = (prefixTreeRoot) => {
 const dict = [];
 const getDictHelper = (prefixTreeNode, prefix) => {
  if (prefixTreeNode === '') return;

  if ('' in prefixTreeNode) {
   dict.push(prefix);
  }

  Object.keys(prefixTreeNode).forEach((letter) => {
   getDictHelper(prefixTreeNode[letter], prefix + letter);
  });
 };

 getDictHelper(prefixTreeRoot, '');
 return dict;
};

const abc = 'abcdefghijklmnopqrstuvwxyz';

// eslint-disable-next-line no-undef
const dict = getDict(validWordTrie);

// prefilter the dict by word length so that this filtered list won't have to be computed again
const dicts = new Array(16).fill().map((_, i) => dict.filter((w) => w.length === i));

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

const dictTrees = dicts.map(makePrefixTree);

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

const makeSolve = (wildCards) => (scramble, length, prefixTreeRoot = dictTrees[length]) => {
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
   } else if (wildCards > 0) {
    // eslint-disable-next-line no-param-reassign
    wildCards -= 1;

    solveHelper(prefixTreeNode[letter], prefix + letter);

    // eslint-disable-next-line no-param-reassign
    wildCards += 1;
   }
  });
 };

 solveHelper(prefixTreeRoot);
 return solutions;
};

const solve = makeSolve(0);

const fake = (scramble) => (
 [...scramble].map((_, i) => [...scramble].slice(0, i).concat([...scramble].slice(i + 1)))
);

const solveFake = (scramble, length, prefixTreeRoot = dictTrees[length]) => {
 const preDict = makePrefixTree(solve(scramble, length, prefixTreeRoot));
 return fake(scramble).map((e) => solve(e, length, preDict));
};

const preSolve = makeSolve(1);

const solveHidden = (scramble, length) => {
 const preDict = makePrefixTree(preSolve(scramble, length));
 return [...abc].map((c) => solveFake(scramble + c, length, preDict));
};

const solveAndFilterHidden = (scramble, length, targetCount) => {
 const solutions = solveHidden(scramble, length);
 const sufficientSolutions = solutions.flat().filter((solution) => solution.length >= targetCount);
 const dupes = new Set();

 const dedupedSolutions = sufficientSolutions.filter((solution) => solution.every((word) => {
  const seen = dupes.has(word);
  dupes.add(word);
  return !seen;
 }));

 // sort in ascending order of number of words
 return dedupedSolutions.sort((a, b) => a.length - b.length);
};

// Next: Solve for two fake and one hidden.

const display = (solutions) => (
 JSON.stringify(solutions.map((w) => (
  `${w} ${score(w)}`
 )).sort((a, b) => (
  Number(b.match(/\d+/)) - Number(a.match(/\d+/))
 ))));

export default {
 solve, solveFake, solveHidden, display, solveAndFilterHidden,
};

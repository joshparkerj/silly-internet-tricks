const dict = [];

const getDict = (t, p) => {
 if (t === '') return;

 if ('' in t) {
  dict.push(p);
 }

 Object.keys(t).forEach((c) => getDict(t[c], p + c));
};

const abc = 'abcdefghijklmnopqrstuvwxyz';

// eslint-disable-next-line no-undef
getDict(validWordTrie, '');

// prefilter the dict by word length so that this filtered list won't have to be computed again
const dicts = new Array(16).fill().map((_, i) => dict.filter((w) => w.length === i));

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

const worksHelper = (scramble, min) => {
 const abcObjMem = JSON.stringify(getEm(scramble));

 return (w) => {
  const abcTemp = JSON.parse(abcObjMem);
  return [...w].every((c) => {
   const valid = abcTemp[c] > min;
   abcTemp[c] -= 1;
   return valid;
  });
 };
};

const works = (scramble) => worksHelper(scramble, 0);
const preWorks = (scramble) => worksHelper(scramble, -1);

const makeSolve = (filterFunction) => (
 (a, l, d = dicts[l]) => d.filter(filterFunction(a))
);

const solve = makeSolve(works);
const preSolve = makeSolve(preWorks);

const fake = (scramble) => (
 [...scramble].map((_, i) => [...scramble].slice(0, i).concat([...scramble].slice(i + 1)))
);

const solveFake = (a, l, d = dicts[l]) => {
 const preDict = solve(a, l, d);
 return fake(a).map((e) => solve(e, l, preDict));
};

const solveMissing = (a, l) => {
 const preDict = preSolve(a, l);
 return JSON.stringify([...abc].map((c) => solveFake(a + c, l, preDict)));
};

export default { solve, solveFake, solveMissing };

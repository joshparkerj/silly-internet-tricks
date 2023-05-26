const count = function count(arr, key, num) {
 const firsts = {};
 arr.forEach((e) => {
  const keyE = key(e);
  if (!firsts[keyE]) {
   firsts[keyE] = e;
  }
 });

 const counts = {};
 arr.forEach((e) => {
  const keyE = key(e);
  const n = num(e);
  counts[keyE] = counts[keyE] ? counts[keyE] + n : n;
 });

 return Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .map((entry) => ({ ...firsts[entry[0]], count: entry[1] }));
};

module.exports = count;

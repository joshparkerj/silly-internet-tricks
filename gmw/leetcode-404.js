/* eslint-disable indent */
const maximumLength = function maximumLength(numbers, k) {
  const results = [];
  const modNumbers = numbers.map((num) => num % k);
  for (let i = 0; i < k; i++) {
    let result = 1;
    let first = 0;
    let second = modNumbers.length;
    for (; first < second; first++) {
      for (let j = 1 + first; j < modNumbers.length; j++) {
        if ((modNumbers[first] + modNumbers[j]) % k === i) {
          second = j;
          break;
        }
      }
    }

    if (second < modNumbers.length) {
      result += 1;
      for (let j = second, l = second + 1; l < modNumbers.length; l++) {
        if ((modNumbers[j] + modNumbers[l]) % k === i) {
          result += 1;
          j = l;
        }
      }
    }

    const allSame = modNumbers.filter(e => e === i).length;
    results.push(result > allSame ? result : allSame);
  }

  return Math.max(...results);
};

export default maximumLength;

/*

[1,2,3,4,5]
2
[1,4,2,3,1,4]
3
[11,500]
980
[1,1,1,1,1,1,1,1,1,1,1,1,1,1]
981
[9,7,4,2,6,7,12,7,5,11,10,8,1,8,10,8,5,8,8,3]
13
[5,3,9]
6
[6,2,3,1,1]
2
[1,7,9,10,8,7,10]
6

*/

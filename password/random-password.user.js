// ==UserScript==
// @name         random password
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  alert a randomly generated password of words and numerals
// @author       Josh Parker
// @match        https://hryanjones.com/guess-my-word/
// @icon         https://www.google.com/s2/favicons?domain=hryanjones.com
// @grant        none
// ==/UserScript==

(function randomPassword() {
 // eslint-disable-next-line no-undef
 const normals = possibleWords.normal;
 // eslint-disable-next-line no-undef
 const hards = possibleWords.hard;
 const randint = (high) => Math.floor(Math.random() * high);
 const choose = (arr) => arr[randint(arr.length)];
 const wordLengthIs = (n) => (w) => w.length === n;
 const wordsOfLength = (n) => normals.filter(wordLengthIs(n)).concat(hards.filter(wordLengthIs(n)));

 const fours = wordsOfLength(4);
 const fives = wordsOfLength(5);
 const randFour = () => choose(fours);
 const randFive = () => choose(fives);
 const randNum = () => randint(10);
 const passComponents = [randFour, randNum, randFive, randNum];
 const randPass = Array(8)
  .fill()
  .map((e, i) => passComponents[i % passComponents.length]())
  .join('');
 const dotPos = randint(randPass.length);
 const dottedRandPass = `${randPass.slice(0, dotPos)}.${randPass.slice(dotPos)}`;
 const capSearchPos = randint(dottedRandPass.length - 1);
 const alertMessage = "Here's a randomly generated password of words and numerals: ";
 for (let i = capSearchPos; i < dottedRandPass.length; i++) {
  if (/^[a-z]/.test(dottedRandPass.slice(i))) {
   // eslint-disable-next-line no-alert
   alert(
    alertMessage
     + dottedRandPass.slice(0, i)
     + dottedRandPass[i].toLocaleUpperCase()
     + dottedRandPass.slice(i + 1),
   );

   return;
  }
 }

 // eslint-disable-next-line no-alert
 alert(alertMessage + dottedRandPass);
}());

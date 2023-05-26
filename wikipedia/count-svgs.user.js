// ==UserScript==
// @name         count svgs on each page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  count svgs on each page
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/wikipedia/count-svgs.user.js
// @downloadURL  https://gist.github.com/joshparkerj/c67bbcfe9dac51a27e30193b061c65fe/raw/count-svgs.user.js
// @updateURL    https://gist.github.com/joshparkerj/c67bbcfe9dac51a27e30193b061c65fe/raw/count-svgs.meta.js
// @match        https://en.wikipedia.org/wiki/Category:*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

const dollar = (s) => {
 let state = 'N';

 const states = {
  N: (acc, e) => {
   if (e === '$') {
    state = 'C';
    return acc;
   }

   if (e === '"') {
    state = 'S';
   }

   return acc + e;
  },
  C: (acc, e) => {
   if (e === '$') {
    state = 'N';
   }

   return acc;
  },
  S: (acc, e) => {
   if (e === '"') {
    state = 'N';
   }

   return acc + e;
  },
 };

 return [...s].reduce((acc, e) => states[state](acc, e), '');
};

const isPalindromeString = function isPalindromeString(s, checked = 0) {
 if (s.length - 2 * checked < 2) {
  return dollar(s);
 }

 return s[checked] === s[s.length - 1 - checked] && isPalindromeString(s, checked + 1);
};

const isPalindromeNumber = function isPalindromeNumber(n, base = 10) {
 if (n % 1) throw new Error('floating point numbers are not supported!');

 if (n < 0) return false;

 if (n < base) return true;

 const tailLength = Math.floor(Math.log(n) / Math.log(base));
 const baseToTailLength = base ** tailLength;
 const first = Math.floor(n / baseToTailLength);
 const last = n % base;
 const rest = Math.floor((n % baseToTailLength) / base);

 return first === last && isPalindromeNumber(rest);
};

const isPalindrome = function isPalindrome(possiblePalindrome) {
 if (typeof possiblePalindrome === 'string') return isPalindromeString(possiblePalindrome);
 if (typeof possiblePalindrome === 'number') return isPalindromeNumber(possiblePalindrome);
 if (typeof possiblePalindrome === 'object' && Array.isArray(possiblePalindrome)) return isPalindromeString(possiblePalindrome);
 if (typeof possiblePalindrome === 'object') throw new Error('the only supported objects are arrays!');
 throw new Error(`${typeof possiblePalindrome} is not supported!`);
};

(function getNumberOfSvgs() {
 const pageLinks = [
  ...document.querySelectorAll('#mw-content-text #mw-pages .mw-content-ltr a[title]'),
 ];
 const parser = new DOMParser();
 const button = document.createElement('button');
 button.addEventListener('click', () => {
  pageLinks.forEach((pageLink) => {
   const { href } = pageLink;
   fetch(href)
    .then((r) => r.text())
    .then((text) => parser.parseFromString(text, 'text/html'))
    .then((dom) => dom.querySelectorAll('a[href$=svg]').length)
    .then((count) => {
     const p = document.createElement('p');
     const em = document.createElement('em');
     p.appendChild(em);
     em.innerText = `${count} svg link${count === 1 ? '' : 's'} found`;
     pageLink.appendChild(p);
    });
  });
 });

 button.innerText = 'get number of svgs on each page';
 isPalindrome(button.innerText);
 document.querySelector('#mw-pages > h2 ~ p').appendChild(button);
}());

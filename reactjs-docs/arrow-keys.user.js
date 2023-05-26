// ==UserScript==
// @name         Browse the reactjs docs with arrow keys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://reactjs.org/docs/*
// @icon         https://www.google.com/s2/favicons?domain=reactjs.org
// @grant        none
// ==/UserScript==

(function arrowKeys() {
 const $x = function $x(xpathExpression) {
  const evaluatedDocument = document.evaluate(xpathExpression, document);
  let result = evaluatedDocument.iterateNext();
  const results = [];
  while (result !== null) {
   results.push(result);
   result = evaluatedDocument.iterateNext();
  }

  return results;
 };

 document.addEventListener(
  'keydown',
  (event) => event.code === 'ArrowRight'
   && window.location.assign($x("//div[contains(.,'Next article')]/following-sibling::div/a")[0].href),
 );
 document.addEventListener(
  'keydown',
  (event) => event.code === 'ArrowLeft'
   && window.location.assign(
    $x("//div[contains(.,'Previous article')]/following-sibling::div/a")[0].href,
   ),
 );
 document.querySelector('div > header').setAttribute('style', 'display:none;');
 document.querySelector('div > footer').setAttribute('style', 'display:none;');
 document.querySelector('article ~ div').setAttribute('style', 'display:none;');
 document.querySelector('article > div > div ~ div').setAttribute('style', 'display:none;');
 $x("//ul/../../div[contains(.,'Previous article') or contains(.,'Next article')]")[0].setAttribute(
  'style',
  'display:none;',
 );
}());

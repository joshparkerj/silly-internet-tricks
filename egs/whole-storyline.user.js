// ==UserScript==
// @name         egs whole storyline
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  display all previous and subsequent comics in this storyline
// @author       Josh Parker
// @match        https://www.egscomics.com/comic/*
// @icon         https://www.google.com/s2/favicons?domain=egscomics.com
// @grant        none
// ==/UserScript==

(function userScript() {
 const parser = new DOMParser();
 const storyline = document.querySelector("select[name='comic-storyline'] > option[selected]");
 const storylineValue = storyline.value;
 const comicbody = document.querySelector('#cc-comicbody');
 const getMore = (href, selector, inserter) => {
  fetch(href)
   .then((r) => r.text())
   .then((t) => parser.parseFromString(t, 'text/html'))
   .then((doc) => {
    const docStorylineValue = doc.querySelector(
     "select[name='comic-storyline'] > option[selected]",
    ).value;
    if (docStorylineValue === storylineValue) {
     const docComicbody = doc.querySelector('#cc-comicbody');
     inserter(comicbody, docComicbody.querySelector('a'));
     getMore(doc.querySelector(selector).href, selector, inserter);
    }
   });
 };

 const prevSelector = 'a[rel=prev]';
 const nextSelector = 'a[rel=next]';
 const getPrev = (href) => getMore(href, prevSelector, (parent, child) => parent.insertBefore(child, parent.querySelector('a')));
 const getNext = (href) => (
  getMore(href, nextSelector, (parent, child) => parent.appendChild(child))
 );

 const prev = document.querySelector('a[rel=prev]');
 const next = document.querySelector('a[rel=next]');
 const showAllButton = document.createElement('button');

 const getStorylineName = function getStorylineName(storylines) {
  for (let i = storylines.length - 1, foundSelected = false; i >= 0; i -= 1) {
   if (storylines[i].getAttribute('selected') !== null) {
    foundSelected = true;
   }

   if (foundSelected) {
    const name = storylines[i].innerText;
    if (name.trim() === name) {
     return name;
    }
   }
  }

  return null;
 };

 showAllButton.innerText = `show all comics from storyline ${getStorylineName([
  ...document.querySelectorAll("select[name='comic-storyline'] > option"),
 ])} ${storyline.innerText.trim()}`;
 showAllButton.addEventListener('click', () => {
  getPrev(prev.href);
  getNext(next.href);
 });

 document
  .querySelector('#leftarea')
  .insertBefore(showAllButton, document.querySelector('div#chapter-dropdown + div + script + hr'));
}());

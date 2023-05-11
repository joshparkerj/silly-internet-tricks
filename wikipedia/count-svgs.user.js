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

(function getNumberOfSvgs() {
  const validWordTrie = {};

  const dict = [];

  const getDict = (trie, prefix = '') => {
    if (Object.keys(trie).includes('')) {
      dict.push(prefix);
    }

    Object.keys(trie)
      .filter((key) => key.match(/^[a-z]$/))
      .forEach((key) => getDict(trie[key], `${prefix}${key}`));
  };

  getDict(validWordTrie);

  const counts = (a) => {
    const r = {};
    a.forEach((e) => {
      if (e in r) {
        r[e] += 1;
      } else {
        r[e] = 1;
      }
    }); return r;
  };

  

  const words = (s, l) => {
    let filteredWords = dict.filter((w) => w.match(new RegExp(`^[${s}]{${l}}$`)));
    const letterCounts = counts([...s]);
    Object.entries(letterCounts).forEach(([c, n]) => {
      filteredWords = filteredWords.filter((w) => !(w.match(new RegExp(`${c}`, 'g'))?.length > n));
    });

    return filteredWords;
  };

  const myWords = words('mywords', 4);

  const pageLinks = [...document.querySelectorAll('#mw-content-text #mw-pages .mw-content-ltr a[title]')];
  const parser = new DOMParser(myWords);
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
  document.querySelector('#mw-pages > h2 ~ p').appendChild(button);
}());

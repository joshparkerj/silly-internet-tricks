// ==UserScript==
// @name         Get Test Execution Times
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make a table of test execution times
// @author       Josh Parker
// @match        https://bitbucket-pipelines.prod.public.atl-paas.net/Pipelines/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitbucket.org
// @grant        none
// ==/UserScript==

(function testExecutionTimes() {
  const parser = new DOMParser();

  const nextSelector = 'button[aria-label=Next]';

  const pages = [document];
  let { href } = window.location;

  const getNext = function getNext(next) {
    return new Promise((resolve, reject) => {
      if (!next || next.disabled) {
        resolve();
      }

      const match = href.match(/(.*)\/(\d+)$/);

      // eslint-disable-next-line no-unused-vars
      const [_, url, page] = match;
      href = `${url}${Number(page) + 1}`;
      fetch(href)
        .then((r) => r.text())
        .then((text) => parser.parseFromString(text, 'text/html'))
        .then((dom) => {
          pages.push(dom);
          resolve(dom.querySelector(nextSelector));
        })
        .catch(() => reject());
    })
      .then((n) => n && getNext(n));
  };

  getNext(document.querySelector(nextSelector));
}());

// ==UserScript==
// @name         get link graph csv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  csv for the purpose of visualizing the connections among all wiki pages
// @author       Josh Parker
// @match        https://aiartcreation.fandom.com/wiki/Special:AllPages
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        none
// ==/UserScript==

(function getLinkGraphCSV() {
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const randint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const sad = ['☹️', '⛈️', '☹️', '😭', '😔', '😔', '💔', '💔'];
  const cry = () => console.log((new Array(randint(6, 8)).fill().map(() => pick(sad)).join('')));

  console.log('hi mom!');
  const pageHeader = document.querySelector('div.page-header');
  const getLinkGraphButton = document.createElement('button');

  getLinkGraphButton.appendChild(new Text('click here to get link graph csv'));
  getLinkGraphButton.addEventListener('click', () => {
    const pageLinkSelector = 'ul.mw-allpages-chunk > li:not(li.allpagesredirect) > a[href^="/wiki"]';
    const allPages = [...document.querySelectorAll(pageLinkSelector)]
      .map(({ href }) => href.match(/wiki\/(.*)$/)[1])
      .filter((page) => !page.match(/\?redirect=no$/));

    const csv = ['"u","v"\n'];

    const parser = new DOMParser();

    let fetchedCount = 0;

    allPages.forEach(async (page) => {
      try {
        const response = await fetch(`https://aiartcreation.fandom.com/wiki/Special:WhatLinksHere/${page}`);

        if (!response.ok) {
          throw new Error('Network response was not OK');
        }

        const text = await response.text();
        const dom = parser.parseFromString(text, 'text/html');
        [...dom.querySelectorAll('ul#mw-whatlinkshere-list > li > a[href^="/wiki"]')]
          .map(({ href }) => href.match(/wiki\/(.*)$/)[1])
          .filter((incomingPage) => !incomingPage.match(/\?redirect=no$/))
          .forEach((incomingPage) => { csv.push(`"${incomingPage}","${page}"\n`); });
      } catch (e) {
        cry();
        console.log(e);
      } finally {
        fetchedCount += 1;
        if (fetchedCount === allPages.length) {
          const downloadCsvButton = document.createElement('button');
          downloadCsvButton.appendChild(new Text('the csv is ready! click here to download'));
          downloadCsvButton.addEventListener('click', () => {
            const blob = new Blob([csv.join('')], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${document.title.split('Series')[0].trim().replace(/\s+/g, '-')}-series.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          });

          pageHeader.appendChild(downloadCsvButton);
        }
      }
    });
  });

  pageHeader.appendChild(getLinkGraphButton);
}());

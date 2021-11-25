// ==UserScript==
// @name         Aggregate the top ten from each of the four categories
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Aggregate the top ten from each of the four categories
// @author       Josh Parker
// @match        https://top10.netflix.com
// @match        https://top10.netflix.com/*
// @icon         https://www.google.com/s2/favicons?domain=netflix.com
// @grant        none
// ==/UserScript==

(function userScript() {
  const links = [
    { url: 'https://top10.netflix.com/films.html', categoryName: 'Films (English)' },
    { url: 'https://top10.netflix.com/films-non-english.html', categoryName: 'Films (Non-English)' },
    { url: 'https://top10.netflix.com/tv.html', categoryName: 'TV (English)' },
    { url: 'https://top10.netflix.com/tv-non-english.html', categoryName: 'TV (Non-English)' }];
  const dateMatch = window.location.href.match(/\/\d{4}-\d\d-\d\d/);
  const parser = new DOMParser();
  const aggregatedRows = [];
  Promise.all(links.map(({ url, categoryName }) => fetch(dateMatch ? url.replace('.html', dateMatch[0]) : url).then((r) => r.text()).then((text) => parser.parseFromString(text, 'text/html')).then((doc) => {
    const tableBodyRows = doc.querySelectorAll('#maincontent + div tbody > tr');
    tableBodyRows.forEach((row) => {
      const categoryCell = document.createElement('td');
      categoryCell.textContent = categoryName;
      const secondCell = row.querySelectorAll('td')[1];
      row.insertBefore(categoryCell, secondCell);
      aggregatedRows.push(row);
    });
  })))
    .then(() => {
      const tableHeaderRow = document.querySelector('#maincontent + div thead > tr');
      const tableHeaderCategorySelect = document.querySelectorAll('#maincontent + div thead > tr > th')[1];
      tableHeaderRow.removeChild(tableHeaderCategorySelect);

      const tableHeaderWeeks = document.querySelectorAll('#maincontent + div thead > tr > th')[1];
      tableHeaderWeeks.insertAdjacentHTML('beforebegin', '<th class="align-bottom border-bottom border-b-2 border-gray-800 pb-1 table-header-text"><span class="pageText">CATEGORY</span></th><th class="align-bottom border-bottom border-b-2 border-gray-800 pb-1 table-header-text"><span class="pageText">NAME</span></th>');

      const body = document.querySelector('#maincontent + div tbody');
      const bodyRows = document.querySelectorAll('#maincontent + div tbody > tr');
      bodyRows.forEach((row) => body.removeChild(row));

      const rowSorter = (row) => Number(row.querySelector('span.inline-block').textContent.replaceAll(',', ''));
      aggregatedRows.sort((a, b) => rowSorter(b) - rowSorter(a));
      aggregatedRows.forEach((row, i) => {
        const r = row;
        r.querySelector('td').textContent = (i + 1);
        body.appendChild(r);
      });
    });

  const mutationObserver = new MutationObserver((m) => {
    const addedNodes = [];
    m.forEach((mutationRecord) => mutationRecord.addedNodes.forEach((node) => {
      addedNodes.push(node);
    }));
    addedNodes.forEach((node) => {
      if (node.getAttribute && node.getAttribute('id').includes('listbox')) {
        node.querySelectorAll('div[id*=option]').forEach((div, i) => {
          const { href } = window.location;
          const hrefPattern = /(?<date>\/\d{4}-\d\d-\d\d)?\.html(?<fragment>#.*)?$/;
          const hrefMatch = href.match(hrefPattern);
          if (hrefMatch) {
            const { date, fragment } = hrefMatch.groups;
            div.addEventListener('click', () => window.location.assign(links[i].url.replace('.html', `${date || ''}.html${fragment || ''}`)));
          } else {
            div.addEventListener('click', () => window.location.assign(links[i].url));
          }
        });
      }
    });
  });

  const categorySelects = document.querySelectorAll('div[id*="category-select"]');
  const observeOptions = { subtree: true, childList: true };
  categorySelects.forEach((select) => mutationObserver.observe(select, observeOptions));

  const addDays = function addDays(date, days) {
    const calculatedDate = new Date(date);
    calculatedDate.setDate(date.getDate() + days);
    return calculatedDate;
  };

  const yyyyMmDd = (date) => date.toISOString().split('T')[0];

  const nearestID = function nearestID(node) {
    const nodeId = node.getAttribute('id');
    if (nodeId) {
      return nodeId;
    }

    const { parentNode } = node;
    if (parentNode) {
      return nearestID(node.parentNode);
    }

    return null;
  };

  const currentWeek = new Date(document.querySelector('main #maincontent .select-week').textContent.split('-')[1].trim());
  const previousWeek = yyyyMmDd(addDays(currentWeek, -7));
  const hrefPattern = /(\/\d{4}-\d\d-\d\d)?\.html(#.*)?$/;
  const prepareClick = function prepareClick(button, dateString) {
    button.addEventListener('click', () => {
      const { href } = window.location;
      let destination;
      if (href.includes('.html')) {
        destination = href.replace(hrefPattern, `/${dateString}.html`);
      } else {
        destination = links[0].url.replace(hrefPattern, `/${dateString}.html`);
      }

      const fragment = nearestID(button);
      if (fragment) {
        destination += `#${fragment}`;
      }

      window.location.assign(destination);
    });
  };

  const prevButtons = document.querySelectorAll('button[aria-label="Previous week"]');
  prevButtons.forEach((prevButton) => prepareClick(prevButton, previousWeek));

  const nextWeek = yyyyMmDd(addDays(currentWeek, 7));
  const nextButtons = document.querySelectorAll('button[aria-label="Next week"]');
  nextButtons.forEach((nextButton) => prepareClick(nextButton, nextWeek));
}());

// ==UserScript==
// @name         series csv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  goodreads data in tabular and csv format
// @author       Josh Parker
// @match        https://www.goodreads.com/series/*
// @icon         https://www.google.com/s2/favicons?domain=goodreads.com
// @grant        none
// ==/UserScript==

(function userScript() {
  let csv = 'title,author,rating,ratings,reviews,date,editions';
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const headerRow = document.createElement('tr');
  csv.split(',').forEach((heading) => {
    const th = document.createElement('th');
    th.textContent = heading;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);
  table.appendChild(tbody);
  document.querySelectorAll('.responsiveBook').map((rb) => {
    const title = rb.querySelector('.gr-h3 span[itemprop="name"]').textContent;
    const author = rb.querySelector('span[itemprop="author"]').textContent;
    const rating = rb.querySelector('.communityRating__starsWrapper ~ .gr-metaText').textContent;
    const allTextContent = rb.textContent;
    const matches = allTextContent.match(/(?<ratings>[\d,]+) Ratings[^\d\w]*((?<reviews>[\d,]+) Reviews)?[^\d\w]*(published (?<date>\d+))?[^\d\w]*((?<editions>\d+) editions)?/);
    return {
      title,
      author,
      rating,
      ...matches.groups,
    };
  }).map(({
    title, author, rating, ratings, reviews, date, editions,
  }) => `\n"${title}","${author}","${rating}","${ratings}","${reviews || 0}","${date || 'unknown'}","${editions || 1}"`)
    .forEach((row) => {
      csv += row;
      const bodyRow = document.createElement('tr');
      row.split(',').forEach((d) => {
        const td = document.createElement('td');
        td.textContent = d.replaceAll('"', '');
        bodyRow.appendChild(td);
      });

      tbody.appendChild(bodyRow);
    });
}());

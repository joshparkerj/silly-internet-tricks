// ==UserScript==
// @name         Most Guessed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the most guessed words
// @author       Josh Parker
// @match        https://hryanjones.com/guess-my-word/board.html?difficulty=hard
// @icon         https://www.google.com/s2/favicons?domain=hryanjones.com
// @grant        none
// ==/UserScript==

(function mostGuessed() {
  const url = 'https://ec2.hryanjones.com/leaderboard/';
  const yyyyMmDd = (date) => date.toISOString().split('T')[0];
  const date = yyyyMmDd(new Date());
  const username = JSON.parse(localStorage.usernamesUsed)[0];
  const word = JSON.parse(localStorage.savedGame_hard).guesses[0];
  fetch(`${url}${date}/wordlist/hard?name=${username}&key=${word}`)
    .then((r) => r.json())
    .then((leaderboard) => {
      const guesses = leaderboard.flatMap((e) => e.guesses);
      const words = {};
      guesses.forEach((guess) => {
        if (words[guess]) {
          words[guess] += 1;
        } else {
          words[guess] = 1;
        }
      });

      const mostGuessedWords = Object.entries(words).sort((a, b) => b[1] - a[1]);

      const table = document.createElement('table');
      table.id = 'most-guessed-words';
      table.innerHTML = `
<thead>
  <tr>
    <th>word</th>
    <th>guesses</th>
  <tr>
</thead>
<tbody>

</tbody>
`;
      const tbody = table.querySelector('tbody');
      mostGuessedWords.forEach(([w, g]) => {
        const tr = document.createElement('tr');
        const wordTd = document.createElement('td');
        wordTd.classList.add('word');
        wordTd.appendChild(new Text(w));
        const guessesTd = document.createElement('td');
        guessesTd.classList.add('guesses');
        guessesTd.appendChild(new Text(g));
        tr.appendChild(wordTd);
        tr.appendChild(guessesTd);
        tbody.appendChild(tr);
      });

      const body = document.querySelector('body');
      body.appendChild(table);

      const css = `
table#most-guessed-words {
  position: absolute;
  top: 5vh;
  right: 5vh;
  height: 50vh;
  overflow: scroll;
  display: block;
}
`;

      const style = document.createElement('style');
      style.appendChild(new Text(css));
      body.appendChild(style);
    });
}());

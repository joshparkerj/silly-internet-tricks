// ==UserScript==
// @name         Most Guessed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the most guessed words
// @author       Josh Parker
// @match        https://hryanjones.com/guess-my-word/board.html*
// @icon         https://www.google.com/s2/favicons?domain=hryanjones.com
// @grant        none
// ==/UserScript==

(function mostGuessed() {
 const url = 'https://ec2.hryanjones.com/leaderboard/';
 const yyyyMmDd = (date) => {
  const match = date.toLocaleString().match(/(\d+)\D+(\d+)\D+(\d+)/);
  return `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
 };

 const date = yyyyMmDd(new Date());

 const username = JSON.parse(localStorage.usernamesUsed)[0];

 const mostGuessedWordsTable = document.createElement('table');
 mostGuessedWordsTable.id = 'most-guessed-words';
 const difficultyChanger = document.getElementById('difficulty-changer');

 const fillTable = () => {
  mostGuessedWordsTable.innerHTML = '';
  const difficulty = difficultyChanger.getAttribute('class');
  const word = JSON.parse(localStorage[`savedGame_${difficulty}`]).guesses[0];

  fetch(`${url}${date}/wordlist/${difficulty}?name=${username}&key=${word}`)
   .then((r) => r.json())
   .then((leaderboard) => {
    const allGuesses = leaderboard
     .filter(({ guesses }) => guesses)
     .flatMap(({ guesses }) => guesses);
    const words = {};
    allGuesses.forEach((guess) => {
     if (words[guess]) {
      words[guess] += 1;
     } else {
      words[guess] = 1;
     }
    });

    const mostGuessedWords = Object.entries(words).sort((a, b) => b[1] - a[1]);

    mostGuessedWordsTable.innerHTML = `
<thead>
  <tr>
    <th>word</th>
    <th>guesses</th>
  <tr>
</thead>
<tbody>

</tbody>
`;
    const tbody = mostGuessedWordsTable.querySelector('tbody');
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
   });
 };

 const body = document.querySelector('body');
 body.appendChild(mostGuessedWordsTable);

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

 const mutationObserver = new MutationObserver(fillTable);

 mutationObserver.observe(difficultyChanger, { attributes: true });

 fillTable();
}());

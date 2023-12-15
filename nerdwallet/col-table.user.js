// ==UserScript==
// @name         cost of living table
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show all of the data in a table (and save as csv if desired)
// @author       Josh Parker
// @match        https://www.nerdwallet.com/cost-of-living-calculator/*
// @icon         https://www.google.com/s2/favicons?domain=nerdwallet.com
// @grant        none
// ==/UserScript==

// This is just not working. It's possible nerdwallet may have blacklisted my ip
(function colTable() {
  const headings = {
    name: 'Name',
    state: 'State',
    milk_cost: 'Gallon of milk',
    eggs_cost: 'Dozen eggs',
    bread_cost: 'Bread',
    apt_rent_cost: 'Median 2-bedroom apartment rent',
    home_cost: 'Median home price (3BR, 2BA)',
    mortgage_plus_interest_cost: 'Mortgage plus interest cost',
    gas_cost: 'Gas (per gallon)',
    optometrist_cost: 'Cost of optometrist visit',
    doctor_cost: 'Cost of a doctor\'s visit',
    dentist_cost: 'Cost of dentist visit',
    lipitor_cost: 'Cost of lipitor',
    quarter_pounder_cost: 'McDonald\'s Quarter-Pounder with cheese',
    pizza_cost: '12-inch Pizza Hut pizza',
    movie_cost: 'Movie ticket',
    yoga_cost: 'Yoga class',
    heineken_cost: '6-pack Heineken beer',
    composite_index: 'Composite cost of living index',
    grocery_index: 'Food Costs index',
    housing_index: 'Housing Costs index',
    utilities_index: 'Utilities Costs index',
    transportation_index: 'Transportation Costs index',
    healthcare_index: 'Healthcare Costs index',
    misc_index: 'Miscellaneous Costs index',
    ranking: 'Ranking',
  };

  const tbody = document.createElement('tbody');
  const openRequest = indexedDB.open('colTable');
  openRequest.onerror = () => console.error('error loading database');
  openRequest.onsuccess = () => {
    const db = openRequest.result;

    const store = db.transaction('colTable').objectStore('colTable');
    store.openCursor().onsuccess = ({ target }) => {
      const cursor = target.result;

      if (cursor) {
        const tr = document.createElement('tr');
        const { value } = cursor;
        Object.keys(headings).forEach((heading) => {
          const td = document.createElement('td');
          td.appendChild(new Text(value[heading]));
          tr.appendChild(td);
        });

        tbody.appendChild(tr);

        cursor.continue();
      } else {
        console.log('items all displayed');
      }
    };
  };

  openRequest.onupgradeneeded = ({ target }) => {
    const newDb = target.result;
    newDb.onerror = () => console.error('error loading database');
    const store = newDb.createObjectStore('colTable', { keyPath: 'col' });
    Object.keys(headings).forEach((heading) => store.createIndex(heading, heading));
    console.log('object store created');
  };

  // learn to guess
  const dict = [];
  const makeDict = function makeDict(trie, prefix = '') {
    Object.keys(trie).forEach((key) => {
      if (key === '') {
        dict.push(prefix);
      }

      makeDict(trie[key], prefix + key);
    });
  };

  // eslint-disable-next-line no-undef
  makeDict(validWordTrie);

  const getCounts = function getCounts(arr) {
    const counts = {};
    arr.forEach((e) => {
      if (e in counts) {
        counts[e] += 1;
      } else {
        counts[e] = 1;
      }
    });

    return counts;
  };

  // eslint-disable-next-line no-unused-vars
  const guess = function guess(letters, len, guessDict = dict) {
    const targetCounts = getCounts([...letters]);
    return guessDict
      .filter((word) => word.length === len)
      .filter((word) => [...word].every((letter) => letters.includes(letter)))
      .filter((word) => (
        Object.entries(getCounts([...word])).every((count) => count[1] <= targetCounts[count[0]])
      ));
  };

  // eslint-disable-next-line no-unused-vars
  const guessHidden = function guessHidden(letters, len) {
    const dictCorrectLength = dict.filter((word) => word.length === len);
    const dictCorrectLetters = dictCorrectLength.filter((word) => {
      let matchCount = 0;
      [...word].forEach((letter) => {
        if (letters.includes(letter)) {
          matchCount += 1;
        }
      });

      // the word may or may not include the hidden letter
      return matchCount === word.length || matchCount === word.length - 1;
    });

    const targetCounts = getCounts([...letters]);
    const dictNoExtraLetters = dictCorrectLetters.filter((word) => (
      Object.entries(getCounts([...word])).every((count) => count[1] <= (
        // if the word contains the hidden letter, the count may be one higher than the target count
        targetCounts[count[0]] + 1
      ))
    ));

    return dictNoExtraLetters;
  };
}());

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

  /* This doesn't work and I'm about to delete it.
  I felt bad about deleting it without committing though, so here we are.

  // eslint-disable-next-line no-underscore-dangle
  const cityIds = window.__INITIAL_STATE__.costOfLivingCalculator.cities.map(({ id }) => id);

  const fetchOptions = (id) => ({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'accept-encoding': 'gzip, delfate, br',
      'accept-language': 'en-US,en;q=0.9',
      'content-length': 48,
      'content-type': 'application/json',
      origin: 'https://www.nerdwallet.com',
      referer: 'https://www.nerdwallet.com',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
    body: {
      ids: [id],
    },
  });

  const apiUrl = 'https://api.nerdwallet.com/homeownership/v1/cost-of-living/city-data?client_id=diy-tools-hac';
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  Object.values(headings).forEach((heading) => {
    const th = document.createElement('th');
    th.appendChild(new Text(heading));
    tr.appendChild(th);
  });

  thead.appendChild(tr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  Promise.all(
    cityIds.map((id) => fetch(apiUrl, fetchOptions(id))
      .then((r) => r.json())
      .then((json) => {
        const row = document.createElement('tr');
        Object.keys(headings).forEach((heading) => {
          const td = document.createElement('td');
          td.appendChild(new Text(json[0][heading]));
          row.appendChild(td);
        });

        tbody.appendChild(row);
      })),
  )
    .then(() => {
      table.appendChild(tbody);
      document.querySelector('body').appendChild(table);
    });

  // TODO: add option to sort table by each column
  // TODO: add option to save table as csv
  */
}());

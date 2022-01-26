// ==UserScript==
// @name         Four Column Responsive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  render text in as many as four columns, depending on display size
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/*
// @exclude      https://en.wikipedia.org/wiki/Category*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function fourColumnResponsive() {
  const css = `
#mw-content-text > #grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  overflow: hidden;
  position: relative;
  top: -37px;
}

#mw-content-text > #grid-container > .mw-parser-output {
  min-width: 0;
  grid-column: span 1;
  position: relative;
  padding: 1em;
  border-right: 1px solid #bbc;
}

@media (max-width: 2000px) {
  #mw-content-text > #grid-container > .mw-parser-output:nth-child(4) {
    display: none;
  }

  #mw-content-text > #grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1500px) {
  #mw-content-text > #grid-container > .mw-parser-output:nth-child(3) {
    display: none;
  }

  #mw-content-text > #grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1000px) {
  #mw-content-text > #grid-container > .mw-parser-output:nth-child(2) {
    display: none;
  }

  #mw-content-text > #grid-container {
    grid-template-columns: repeat(1, 1fr);
  }
}

div#mw-panel,
div#mw-head,
div#mw-page-base,
div#siteSub,
h1#firstHeading {
    z-index: 1;
}

div#mw-page-base,
div#siteSub,
h1#firstHeading {
    position: relative;
}

div#siteSub,
h1#firstHeading {
    background-color: white;
}

div#siteSub,
h1#firstHeading {
  padding-top: 21px;
}

div#siteSub {
  top: -29px;
}

h1#firstHeading {
    top: -21px;
    border-top: 1px solid #a7d7f9
}
`;

  const gridContainer = document.createElement('div');
  gridContainer.id = 'grid-container';

  const mct = document.querySelector('div#mw-content-text');
  mct.appendChild(gridContainer);

  const mpo = mct.querySelector('.mw-parser-output');
  mpo.querySelectorAll('.wikitable').forEach((wikitable) => {
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');
    tableContainer.appendChild(wikitable.cloneNode(true));
    tableContainer.style.setProperty('max-width', '100%');
    tableContainer.style.setProperty('overflow', 'auto');
    if (wikitable.getAttribute('align') === 'right') {
      tableContainer.style.setProperty('float', 'right');
    }

    wikitable.insertAdjacentElement('afterend', tableContainer);
    wikitable.parentNode.removeChild(wikitable);
  });

  for (let i = 0; i < 4; i++) {
    gridContainer.appendChild(mpo.cloneNode(true));
  }

  mpo.parentNode.removeChild(mpo);

  const style = document.createElement('style');
  style.appendChild(new Text(css));
  gridContainer.appendChild(style);

  const intersectionObserver = new IntersectionObserver((e, o) => {
    const columnHeight = e[0].intersectionRect.height;
    const totalHeight = e[0].target.scrollHeight;
    const columns = [...document.querySelectorAll('#grid-container > .mw-parser-output')]
      .filter((column) => getComputedStyle(column).getPropertyValue('display') !== 'none');
    columns.forEach((column, i) => {
      const top = columnHeight * i;
      column.style.setProperty('top', `-${top}px`);
    });

    if (totalHeight > columns.length * columnHeight) {
      gridContainer.style.setProperty('height', `${totalHeight - (columns.length - 1) * columnHeight}px`);
    } else {
      gridContainer.style.setProperty('height', `${totalHeight / columns.length}px`);
    }

    o.disconnect();
  });

  const resizeColumns = () => intersectionObserver.observe(document.querySelector('#grid-container > .mw-parser-output'));

  resizeColumns();
  for (let i = 0; i < 10; i++) {
    setTimeout(resizeColumns, 200 * i);
  }

  setInterval(resizeColumns, 2000);
}());

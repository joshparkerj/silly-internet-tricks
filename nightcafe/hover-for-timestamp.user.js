// ==UserScript==
// @name         hover over time to see timestamp
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hover over time to see timestamp
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function hoverForTimestamp() {
  const timeSelector = '#__next [itemprop=mainEntity] h1 + p';
  const css = `
#timestamp-element {
  display: none;
  position: fixed;
  background-color: white;
  padding: 1rem;
  box-shadow: 4px 3px 5px grey;
}

${timeSelector} {
  padding: 0.5rem;
}
`;

  const timestampElement = document.createElement('div');
  timestampElement.setAttribute('id', 'timestamp-element');

  const style = document.createElement('style');
  style.appendChild(new Text(css));

  const body = document.querySelector('body');
  body.appendChild(timestampElement);
  body.appendChild(style);

  const getTime = async () => {
    if (!window.location.href.includes('creation')) return;

    const time = document.querySelector(timeSelector);

    if (!time.textContent.includes('Created')) return;

    const { buildId } = JSON.parse(document.querySelector('#__NEXT_DATA__').textContent);
    const creationId = window.location.href.match(/creation\/(.*)/)[1];
    const dataHref = window.location.href.replace(/creation.*/, `_next/data/${buildId}/creation/${creationId}.json?cid=${creationId}`);

    const r = await fetch(dataHref);
    const j = await r.json();

    const { created } = j.pageProps.initialJob;
    const createdDate = new Date(created);
    const readableDate = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`;

    timestampElement.innerHTML = '';
    timestampElement.appendChild(new Text(readableDate));

    time.addEventListener('mouseenter', ({ x, y }) => {
      timestampElement.style.setProperty('display', 'block');
      timestampElement.style.setProperty('left', `${x}px`);
      timestampElement.style.setProperty('top', `${y}px`);
    });

    time.addEventListener('mouseleave', () => { timestampElement.style.removeProperty('display'); });
  };

  const titleObserver = new MutationObserver(getTime);

  titleObserver.observe(document.querySelector('head > title'), { childList: true });

  getTime();
}());

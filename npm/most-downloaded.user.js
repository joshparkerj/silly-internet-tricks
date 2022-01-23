// ==UserScript==
// @name         Most downloaded versions of an npm package
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  On the npm website, show the top ten most downloaded versions
// @author       Josh Parker
// @match        https://www.npmjs.com/package/*
// @icon         https://www.google.com/s2/favicons?domain=npmjs.com
// @grant        none
// ==/UserScript==

(function mostDownloadedUserScript() {
  const getMostDownloaded = () => {
    const parser = new DOMParser();
    const downloadCount = (version) => version.querySelector('.downloads').textContent;
    const downloadNumber = (version) => Number(downloadCount(version).replaceAll(',', ''));
    const versionNumber = (version) => version.querySelector('a.code').textContent;
    const noDupes = (arr) => (
      arr.filter((e, i) => i === arr.findIndex((f) => versionNumber(e) === versionNumber(f)))
    );

    fetch('?activeTab=versions')
      .then((response) => response.text())
      .then((text) => parser.parseFromString(text, 'text/html'))
      .then((doc) => doc.querySelectorAll('#tabpanel-versions li'))
      .then((nodelist) => [...nodelist])
      .then((elements) => elements.filter((element) => element.querySelector('a.code')))
      .then((versions) => noDupes([...versions])
        .sort((a, b) => downloadNumber(b) - downloadNumber(a)))
      .then((sortedVersions) => sortedVersions.slice(0, 10))
      .then((mostDownloadedVersions) => {
        const versionLength = Math.max(...mostDownloadedVersions.map((v) => (
          versionNumber(v).length
        )));

        const downloadLength = Math.max(...mostDownloadedVersions.map((v) => (
          downloadCount(v).length
        )));

        const makeReadable = (v) => `version number ${versionNumber(v).padStart(versionLength, ' ')} : ${downloadCount(v).padStart(downloadLength, ' ')} downloads`;
        const pre = document.createElement('pre');
        pre.id = 'most-downloaded-versions';
        mostDownloadedVersions.forEach((version) => {
          const versionDiv = document.createElement('div');
          const readableVersion = makeReadable(version);
          versionDiv.textContent = readableVersion;
          pre.appendChild(versionDiv);
        });

        const style = document.createElement('style');
        style.textContent = '#most-downloaded-versions { position: fixed; background-color: lightgrey; padding: 5px 10px; top: 62px; right: 10px; border-radius: 16px; box-shadow: 2px 2px 1px black; z-index: 2; }';
        style.textContent += '#most-downloaded-versions > pre { font-family: monospace; }';
        const head = document.querySelector('head');
        head.appendChild(style);
        const body = document.querySelector('body');
        body.appendChild(pre);
      });
  };

  const mutationObserver = new MutationObserver((mutationRecords, observer) => {
    getMostDownloaded();
    observer.disconnect();
    observer.observe(document.querySelector('h2 > span'), { attributes: true });
  });

  mutationObserver.observe(document.querySelector('h2 > span'), { attributes: true });
  getMostDownloaded();
}());

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
  const parser = new DOMParser();
  const versionSorter = (version) => version.querySelector('.downloads').textContent.replaceAll(',', '');
  fetch('?activeTab=versions')
    .then((response) => response.text())
    .then((text) => parser.parseFromString(text, 'text/html'))
    .then((doc) => doc.querySelectorAll('#tabpanel-versions li'))
    .then((nodelist) => [...nodelist])
    .then((elements) => elements.filter((element) => element.querySelector('a.code')))
    .then((versions) => [...versions].sort((a, b) => versionSorter(b) - versionSorter(a)))
    .then((sortedVersions) => sortedVersions.slice(0, 10))
    .then((mostDownloadedVersions) => {
      const makeVersionReadable = (v) => `version number ${v.querySelector('a.code').textContent} : ${v.querySelector('code.downloads').textContent} downloads`;
      const div = document.createElement('div');
      div.id = 'most-downloaded-versions';
      mostDownloadedVersions.forEach((version) => {
        const versionDiv = document.createElement('div');
        versionDiv.textContent = makeVersionReadable(version);
        div.appendChild(versionDiv);
      });

      const style = document.createElement('style');
      style.textContent = '#most-downloaded-versions { position: fixed; background-color: lightgrey; padding: 5px 10px; top: 62px; right: 10px; border-radius: 16px; box-shadow: 2px 2px 1px black; z-index: 2; }';
      const head = document.querySelector('head');
      head.appendChild(style);
      const body = document.querySelector('body');
      body.appendChild(div);
    });
}());

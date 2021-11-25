// ==UserScript==
// @name         Roblox games filter.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.roblox.com/games/*
// @match        https://www.roblox.com/discover/*
// @grant        none
// ==/UserScript==

(function robloxGamesFilterUserScript() {
  for (let i = 1; i <= 10; i += 1) {
    setTimeout(() => [...document.querySelectorAll('.game-card')].filter((card) => {
      const noVote = card.querySelector('.no-vote');

      if (noVote) {
        return true;
      }

      const nativeAdLabel = card.querySelector('.native-ad-label');

      if (nativeAdLabel) {
        return true;
      }

      const votePercentageLabel = card.querySelector('.vote-percentage-label').textContent.slice(0, -1);
      const playingCountsLabel = card.querySelector('.playing-counts-label').title;
      const remove = votePercentageLabel < 76 || playingCountsLabel < 30;
      return remove;
    }).forEach((card) => { const c = card; c.style = 'display: none'; }), 2000 * i);
  }
}());

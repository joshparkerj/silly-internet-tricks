// ==UserScript==
// @name         filter by viewers
// @namespace    http://tampermonkey.net/
// @version      2024-02-29
// @description  hide the channels that have more viewers than a certain amount
// @author       Josh Parker
// @match        https://www.twitch.tv/directory/all
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==

(function filterByViewers() {
 const moOptions = {
  subtree: true,
  childList: true,
 };

 const bodyMoCallback = function bodyMoCallback(_, mutationObserver) {
  const directoryContainer = document.querySelector('[data-target="directory-container"]');
  console.log(directoryContainer);
  if (!directoryContainer) {
   console.log('will retry');
   return;
  }

  const moCallback = function moCallback() {
   const dataTargets = directoryContainer
    .querySelectorAll('.tw-tower > [data-target]');
   dataTargets.forEach((dataTarget) => {
    const twMediaCardStat = dataTarget.querySelector('.tw-media-card-stat');
    if (
     twMediaCardStat.textContent.match(/\dK/i)
      || twMediaCardStat.textContent.match(/\d{3}/)
      || twMediaCardStat.textContent.match(/[4-9]\d/)
      || twMediaCardStat.textContent.match(/39/)
    ) dataTarget.style.setProperty('display', 'none');
   });
  };

  const mo = new MutationObserver(moCallback);
  mo.observe(directoryContainer, moOptions);

  mutationObserver.disconnect();
 };

 const bodyMo = new MutationObserver(bodyMoCallback);
 bodyMo.observe(document.body, moOptions);
}());

// ==UserScript==
// @name         Filter history
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter history by video length
// @author       You
// @match        https://www.youtube.com/feed/history
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// ==/UserScript==

(function filterHistory() {
 // max and min hardcoded for now
 // TODO: add user input for max and min
 const MAX = 12 * 60;
 const MIN = 60;

 // do it like once every two seconds for twenty seconds idk
 const filter = () => {
  const titles = [...document.querySelectorAll('#contents ytd-video-renderer')];
  titles.forEach((title) => {
   const spanClassTime = title.querySelector('span[class*=time]').textContent;
   const hms = spanClassTime
    .trim()
    .split(':')
    .map((n) => Number(n));
   const videoLength = Number(
    hms.length === 3 ? hms[0] * 3600 + hms[1] * 60 + hms[0] : hms[0] * 60 + hms[1],
   );

   if (videoLength < MIN) {
    title.parentNode.removeChild(title);
   }

   if (videoLength > MAX) {
    title.parentNode.removeChild(title);
   }
  });
 };

 for (let i = 10; i <= 600; i += 10) {
  setTimeout(filter, i * 1000);
 }
}());

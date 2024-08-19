// ==UserScript==
// @name         leaderboard archmagi deets
// @namespace    http://tampermonkey.net/
// @version      2024-08-19
// @description  get some aggregate stats etc. regarding the archmagi of the boot dot dev arcanum
// @author       Josh Parker
// @match        https://www.boot.dev/leaderboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boot.dev
// @grant        GM_xmlhttpRequest
// @connect      github.com
// ==/UserScript==
const sleeper = (ms, f) => (
 new Promise((solve, ject) => {
  setTimeout(() => {
   f().then((r) => solve(r)).catch((e) => ject(e));
  }, ms);
 })
);

(function leaderboardArchmagiDeets() {
 const parser = new DOMParser();
 const wizardZone = document.querySelector('.items-center + .px-4 > div[class="lg:gap-2 xl:columns-2 2xl:columns-3"]');
 const consoleLogDeetsButton = document.createElement('button');
 consoleLogDeetsButton.textContent = 'console log deets';
 consoleLogDeetsButton.addEventListener('click', () => {
  const archmagi = Promise.all([...wizardZone.querySelectorAll('a')].map(async (e, i) => {
   const end = new Date(e.querySelector('.justify-end').textContent);
   const {
    start, name, level, lessonsSolved, github,
   } = await fetch(e.href)
    .then((r) => r.text()).then((t) => {
     const dom = parser.parseFromString(t, 'text/html');
     const deets = {};
     deets.start = new Date(dom.querySelector('.break-words + div .text-center + div + div span + span.font-bold.text-lg').textContent);
     deets.name = `${dom.querySelector('h2.font-bold').textContent} (${dom.querySelector('h2.font-bold + span').textContent})`;
     deets.level = Number(dom.querySelector('.glassmorph .text-2xl span.font-bold.text-white').textContent);
     deets.lessonsSolved = Number(dom.querySelector('.break-words + .glassmorph span.text-2xl.font-bold.text-white').textContent);
     deets.githubLinks = dom.querySelectorAll('a[href*=github]');
     if (deets.githubLinks.length === 0) {
      deets.github = null;
     } else {
      const hrefMatch = deets.githubLinks[0].href.match(/https:\/\/github.com\/[^/]*/);
      if (hrefMatch) {
       [deets.github] = hrefMatch;
      } else {
       console.warn('link pattern not as expected!');
       console.warn(deets.github);
       deets.github = null;
      }
     }

     return deets;
    });
   let githubFollowers = 0;
   if (github) {
    githubFollowers = await sleeper(2000 * i, () => (GM.xmlHttpRequest({ url: github })
     .then((r) => r.responseText).then((t) => {
      const dom = parser.parseFromString(t, 'text/html');
      const followersLink = dom.querySelector('a[href$=followers] span');
      if (!followersLink) {
       return 0;
      }

      return Number(followersLink.textContent);
     })));
   }

   const milliPerDay = 24 * 60 * 60 * 1000;
   const time = Math.round((end - start) / milliPerDay);
   const age = Math.round((Date.now() - start) / milliPerDay);
   const lessonsSolvedPerDay = lessonsSolved / age;
   const completedDeets = {
    end, start, time, name, level, lessonsSolved, age, lessonsSolvedPerDay, github, githubFollowers,
   };

   console.log(completedDeets);
   return completedDeets;
  })).then((arcanum) => arcanum.sort((a, b) => b.githubFollowers - a.githubFollowers));
  console.log(archmagi);
 });

 consoleLogDeetsButton.style.setProperty('padding', '1rem');
 consoleLogDeetsButton.style.setProperty('color', 'chartreuse');
 document.body.appendChild(consoleLogDeetsButton);
}());

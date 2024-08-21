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
   f().then(solve).catch(ject);
  }, ms);
 })
);

(function leaderboardArchmagiDeets() {
 const parser = new DOMParser();
 const wizardZone = document.querySelector('.items-center + .px-4 > div[class="lg:gap-2 xl:columns-2 2xl:columns-3"]');

 const getGithubCheckbox = document.createElement('input');
 getGithubCheckbox.setAttribute('type', 'checkbox');
 getGithubCheckbox.setAttribute('name', 'get-github');
 getGithubCheckbox.setAttribute('id', 'get-github');
 const getGithubCheckboxLabel = document.createElement('label');
 getGithubCheckboxLabel.setAttribute('for', 'get-github');
 getGithubCheckboxLabel.textContent = 'check here to get deets from github (much slower)';

 const consoleLogDeetsButton = document.createElement('button');
 consoleLogDeetsButton.textContent = 'console log deets';
 consoleLogDeetsButton.addEventListener('click', () => {
  const archmagi = Promise.all([...wizardZone.querySelectorAll('a')].map(async (e, i) => {
   const end = new Date(e.querySelector('.justify-end').textContent);
   const deets = await fetch(e.href)
    .then((r) => r.text()).then((t) => {
     const dom = parser.parseFromString(t, 'text/html');
     const deetsResult = {};
     deetsResult.start = new Date(dom.querySelector('.break-words + div .text-center + div + div span + span.font-bold.text-lg').textContent);
     deetsResult.name = `${dom.querySelector('h2.font-bold').textContent} (${dom.querySelector('h2.font-bold + span').textContent})`;
     deetsResult.level = Number(dom.querySelector('.glassmorph .text-2xl span.font-bold.text-white').textContent);
     deetsResult.lessonsSolved = Number(dom.querySelector('.break-words + .glassmorph span.text-2xl.font-bold.text-white').textContent);
     deetsResult.certificates = [...dom.querySelectorAll('a[href^="/certificate/"] h3')].map((cert) => cert.textContent);
     deetsResult.githubLinks = dom.querySelectorAll('a[href*=github]');
     if (deetsResult.githubLinks.length === 0) {
      deetsResult.github = null;
     } else {
      const hrefMatch = deetsResult.githubLinks[0].href.match(/https:\/\/github.com\/[^/]*/);
      if (hrefMatch) {
       [deetsResult.github] = hrefMatch;
      } else {
       console.warn('link pattern not as expected!');
       console.warn(deetsResult.github);
       deetsResult.github = null;
      }
     }

     return deetsResult;
    });
   let githubFollowers = 0;
   if (deets.github && getGithubCheckbox.checked) {
    githubFollowers = await sleeper(2000 * i, () => (GM.xmlHttpRequest({ url: deets.github })
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
   const time = Math.round((end - deets.start) / milliPerDay);
   const age = Math.round((Date.now() - deets.start) / milliPerDay);
   const lessonsSolvedPerDay = deets.lessonsSolved / age;
   const completedDeets = {
    ...deets, end, time, age, lessonsSolvedPerDay, githubFollowers,
   };

   console.log(completedDeets);
   return completedDeets;
  })).then((arcanum) => arcanum.sort((a, b) => b.githubFollowers - a.githubFollowers));
  console.log(archmagi);
 });

 const userscriptZone = document.createElement('div');
 userscriptZone.style.setProperty('padding', '1rem');
 userscriptZone.style.setProperty('color', 'chartreuse');
 userscriptZone.appendChild(consoleLogDeetsButton);
 userscriptZone.appendChild(getGithubCheckbox);
 userscriptZone.appendChild(getGithubCheckboxLabel);
 document.body.appendChild(userscriptZone);
}());

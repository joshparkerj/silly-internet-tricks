// ==UserScript==
// @name         Night Cafe Personal Prompt Finder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  console log links to the creations that contain the prompt text
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/my-creations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function nightCafePersonalPromptFilter() {
  // For this early iteration, I'll probably hard code the search terms here.
  const searchTerms = `albertbierstadt albertgleizes alexanderjansson alexgrey alexhirsch almondby
alphonsemucha amandasage annestokes anunnakiby arthurrackham avalonby basteiby benbocquelet
berniewrightson billpeet canaletto carcosaby caspardavidfriedrich chrisvanallsburg classroomby
claudemonet cleopatra colosseumby coyoteby danmumford danwitz davidahardy davidchoe davpilkey denaliby
denisvilleneuve drewstruzan edwardhopper emilycarr ferdinandknab frankfrazetta gandalfby
georgykurasov geraldbrom godzilla gold gregrutkowski grendel guidoborelli guillotine gumballby
gustavedore gustavklimt howardpyle hrgiger jackkirby jacqueslouisdavid jakubschikaneder jamesgurney
jeantinguely jewelby jgquintel jimburns jinnby johnbutleryeats johnconstable josephinewall jrrtolkien
juliapott kandinsky kellyfreas landscape leonidafremov lilypad lisafrank louismaurer
maartenvanheemskerck makotoshinkai marshby mattepainting maxernst maxfleischer michaelcheval michaelvincentmanalo
michaelwhelan midsummerby mirkwoodby moatby moebius monopolyby mordorby naokotakeuchi nationalpark
normanrockwell odilonredon opheliaby pabloamaringo pablopicasso pendletonward penthouseby petermohrbacher detailedphotograph
picasso pinodaeni rafaelsanti rainby ralphmcquarrie raphael ravenby rayharryhausen rebeccasugar
richardwilliams rogerdean rosstran salvadordali scaryskeletonastronautinspace sedonaby shoreby spongebob stephanmartiniere
stevenbelledin stevenhillenberg strawberryby studioghibli summercampisland sunsetby swampby thomaskinkade
timburton titian torch tundraby valinorby vangogh volcanoby wadimkashin watercolor waterfallby wesanderson
wojciechsiudmak yahwehby yosemiteby zdzislawbeksinski zukoby`.split(/\s/g);

 const results = {};

 const parser = new DOMParser();
 const fetched = new Set();

 const findCreations = () => {
  document.querySelectorAll('.css-erlp54').forEach(async (card) => {
   const link = card.querySelector('[href^="/creation"]')?.href;

   if (!link || fetched.has(link)) return;

   fetched.add(link);

   const response = await fetch(link);
   const text = await response.text();
   const dom = parser.parseFromString(text, 'text/html');
   const selector = '#__next [itemprop=mainEntity] .css-1gzn9ne > .css-ntik0p > .css-q8r9lz';
   const descriptiveElement = dom.querySelector(selector);

   if (!descriptiveElement) return;

   descriptiveElement.querySelectorAll('style').forEach((styleElement) => {
    styleElement.parentNode.removeChild(styleElement);
   });

   const textPrompts = descriptiveElement.textContent
    .match(/"[^"]*/g)
    .filter((t) => !t.includes('weight'))
    .map((t) => t.slice(1))
    .reduce((acc, e) => acc + e, '');
   const searchableText = textPrompts
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[\s\W]+/g, '');

   // at this point we have the searchable text.
   // Time to check it for matches against ALL THE TERMS IN THE WHOLE DAMN LIST!

      searchTerms.filter((searchTerm) => searchableText.includes(searchTerm))
        .forEach((searchTerm) => {
          if (results[searchTerm]) {
            results[searchTerm].push(link);
          } else {
            results[searchTerm] = [link];
          }

          console.log(JSON.stringify(results));
        });
    });
  });
 };

 const mo = new MutationObserver(findCreations);

 mo.observe(document.querySelector('#__next > div'), { subtree: true, childList: true });
}());

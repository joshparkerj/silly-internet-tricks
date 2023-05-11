// ==UserScript==
// @name         Night Cafe Personal Prompt Finder (Uncollected)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  creations that contain the prompt text and are not in a matching collection
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/my-creations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function nightCafePersonalPromptFilter() {
  // Hardcoded search terms.
  // For a future iteration, it might be better to have a UI to input the search terms.
  const searchTerms = `jamesgurney pabloamaringo gregrutkowski georgykurasov albertgleizes
thomaskinkade gustavedore salvadordali hrgiger jimburns kandinsky picasso vangogh alexhirsch
alphonsemucha amandasage benbocquelet berniewrightson canaletto caspardavidfriedrich claudemonet
danmumford danwitz edwardhopper ferdinandknab geraldbrom guidoborelli gustavklimt jgquintel
jeantinguely josephinewall juliapott kellyfreas leonidafremov maxernst moebius pablopicasso
pendletonward pinodaeni rafaelsanti rebeccasugar rogerdean stevenbelledin stevenhillenberg
studioghibli timburton wadimkashin wesanderson zdzislawbeksinski davpilkey naokotakeuchi spongebob
alexgrey summercampisland raphael denali zuko gandalf cleopatra tundra coyote classroom carcosa
monopoly strawberry colosseum mirkwood swamp anunnaki penthouse bastei guillotine gumball ophelia
almond raven avalon grendel gold jinn godzilla lilypad sedona midsummer moat yahweh jewel waterfall
volcano landscape rain mordor marsh nationalpark sunset torch shore yosemite albertbierstadt
alexanderjansson annestokes arthurrackham billpeet chrisvanallsburg davidahardy davidchoe
denisvilleneuve drewstruzan emilycarr frankfrazetta howardpyle jrrtolkien jackkirby
jacqueslouisdavid jakubschikaneder johnbutleryeats johnconstable lisafrank louismaurer
maartenvanheemskerck makotoshinkai maxfleischer michaelvincentmanalo michaelcheval michaelwhelan
normanrockwel odilonredon ralphmcquarrie rayharryhausen richardwilliams rosstran stephanmartiniere
titian wojciechsiudmak matte watercolor photograph`.split(/\s/g);

  const results = {};

  const parser = new DOMParser();
  const fetched = new Set();

  const searchable = (s) => s.normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
    .replace(/[\s\W]+/g, '');

  fetch('https://creator.nightcafe.studio/my-collections')
    .then((r) => r.text())
    .then((t) => {
      const dom = parser.parseFromString(t, 'text/html');
      return Promise.all([...dom.querySelectorAll('[href^="/collection"]')]
        .map(({ href, textContent }) => (fetch(href).then((r) => r.text())
          .then((collectionHtml) => {
            const collectionDom = parser.parseFromString(collectionHtml, 'text/html');
            return [searchable(textContent), dom];
          })
        )));
    })
    .then((collections) => {
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

          const textPrompts = descriptiveElement.textContent.match(/"[^"]*/g)
            .filter((t) => !t.includes('weight')).map((t) => t.slice(1))
            .reduce((acc, e) => acc + e, '');
          const searchableText = searchable(textPrompts);

          // at this point we have the searchable text.
          // Time to check it for matches against ALL THE TERMS IN THE WHOLE DAMN LIST!

          searchTerms.filter((searchTerm) => searchableText.includes(searchTerm))
            .forEach((searchTerm) => {
              // check to see if it's in the collection that matches the search term:

              if (results[searchTerm]) {
                results[searchTerm].push(link);
              } else {
                results[searchTerm] = [link];
              }
            });
        });
      };

      const mo = new MutationObserver(findCreations);

      mo.observe(document.querySelector('#__next > div'), { subtree: true, childList: true });
    });
}());

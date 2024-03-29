const testCases = [
 { name: 'finds main tag', assertions: [{ query: 'main', result: 'THIS IS THE MAIN' }] },
 { name: 'error on empty query', assertions: [{ query: '' }] },
 { name: 'error on combinator prefix', assertions: [{ query: '> body' }] },
 { name: 'error on combinator suffix', assertions: [{ query: 'body >' }] },
 {
  name: 'finds child of p',
  assertions: [{ query: 'p a', result: 'this a is in the p in the div' }],
 },
 {
  name: 'finds child of p which is child of div',
  assertions: [{ query: 'div p a', result: 'this a is in the p in the div' }],
 },
 {
  name: 'finds element with class cool-class',
  assertions: [{ query: '.cool-class', result: 'THIS IS THE COOL CLASS' }],
 },
 { name: 'finds span with correct class', assertions: [{ query: 'span.b', result: 'banana' }] },
 {
  name: 'finds class d with correct tag name',
  assertions: [{ query: 'strong.d', result: 'd mighty' }],
 },
 { name: 'finds descendant', assertions: [{ query: 'footer span', result: 'footer text' }] },
 {
  name: 'finds descendant with class names specified',
  assertions: [{ query: 'footer.end span.end-inline', result: 'footer text' }],
 },
 {
  name: 'correctly navigates relationships between class parents and children',
  assertions: [
   { query: '.good .good', result: 'GOODGOOD' },
   { query: '.good .bad', result: 'GOODBAD' },
   { query: '.bad .good', result: 'BADGOOD' },
   { query: '.bad .bad', result: 'BADBAD' },
  ],
 },
 {
  name: 'finds the element with an id',
  assertions: [{ query: '#an-id', result: 'I have an id.' }],
 },
 {
  name: 'finds the element with a class and a parent with an id',
  assertions: [{ query: '#bad .bad', result: 'id BADBAD' }],
 },
 {
  name: 'finds the link with the href attribute',
  assertions: [{ query: 'a[href]', result: 'a with an href' }],
 },
 { name: 'finds the first matching element', assertions: [{ query: 'ol li', result: 'one' }] },
 {
  name: 'finds the earlier element, not the shallower one',
  assertions: [{ query: '.depth', result: 'this is the deep div early in the document' }],
 },
 { name: 'null on element without child', assertions: [{ query: '#an-id div', result: null }] },
 {
  name: 'finds element with attribute exact match',
  assertions: [{ query: 'label[name=three]', result: 'label name three' }],
 },
 {
  name: 'finds element with attribute word match',
  assertions: [{ query: 'abbr[title~=Federal]', result: 'FBI' }],
 },
 {
  name: 'finds element with attribute word match even without closing square bracket',
  assertions: [{ query: 'abbr[title~=Federal', result: 'FBI' }],
 },
 {
  name: 'finds element with attribute prefix match',
  assertions: [{ query: 'abbr[title^=Fed]', result: 'FBI' }],
 },
 {
  name: 'finds element with attribute suffix match',
  assertions: [{ query: 'abbr[title$=cy]', result: 'CIA' }],
 },
 {
  name: 'finds element with attribute contains match',
  assertions: [{ query: 'abbr[title*=lig]', result: 'CIA' }],
 },
 {
  name: 'works with shouty tag names',
  assertions: [{ query: 'DIV P ABBR[title^=Fed]', result: 'FBI' }],
 },
 {
  name: 'can match attribute without tagname',
  assertions: [{ query: '[title^=Fed]', result: 'FBI' }],
 },
 {
  name: 'can match attribute with universal selector',
  assertions: [{ query: '*[title^=Fed]', result: 'FBI' }],
 },
 {
  name: 'can match descendant with universal selector',
  assertions: [{ query: 'head *', result: 'THIS IS THE TITLE' }],
 },
 {
  name: 'can match child attribute without tagname',
  assertions: [{ query: 'DIV P [title^=Fed]', result: 'FBI' }],
 },
 {
  name: 'can match descendant attribute without tagname',
  assertions: [{ query: 'DIV [title^=Fed]', result: 'FBI' }],
 },
 {
  name: 'does not match descendent when using child combinator',
  assertions: [{ query: 'DIV > [title^=Fed]', result: null }],
 },
 {
  name: 'matches child when using child combinator',
  assertions: [{ query: 'DIV > P > [title^=Fed]', result: 'FBI' }],
 },
 {
  name: 'matches sibling when using general sibling combinator',
  assertions: [{ query: '[title^=Fed] ~ *', result: 'CIA' }],
 },
 {
  name: 'matches immediate sibling when using adjacent sibling combinator',
  assertions: [{ query: '[name=three] + *', result: 'label name four' }],
 },
 {
  name: 'matches immediate sibling by attribute when using adjacent sibling combinator',
  assertions: [{ query: '[name=three] + [name=four]', result: 'label name four' }],
 },
 {
  name: 'does not match non-immediate sibling when using adjacent sibling combinator',
  assertions: [{ query: '[name=three] + [name=five]', result: null }],
 },
 {
  name: 'matches non-immediate sibling when using general sibling combinator',
  assertions: [{ query: '[name=three] ~ [name=five]', result: 'label name five' }],
 },
 {
  name: 'does not match child or descendent when using sibling combinators',
  assertions: [
   { query: 'p.good + span.good', result: null },
   { query: 'p.good ~ span.good', result: null },
   { query: 'footer.end + span.end-inline', result: null },
   { query: 'footer.end ~ span.end-inline', result: null },
  ],
 },
 {
  name: 'can use selector list',
  assertions: [
   { query: 'p span    ,  p a', result: 'this a is in the p in the div' },
   { query: 'p a    ,  p span', result: 'this a is in the p in the div' },
  ],
 },
 {
  name: 'can match any combination of classes',
  assertions: [
   { query: '#battleship label', result: 'Zebras' },
   { query: '#battleship .albuquerque', result: 'Albatrosses' },
   { query: '#battleship .bismarck', result: 'Beavers' },
   { query: '#battleship .canberra', result: 'Cranes' },
   { query: '#battleship .denver', result: 'Dolphins' },
   { query: '#battleship .albuquerque.bismarck', result: 'Alligators and Bison' },
   { query: '#battleship .albuquerque.canberra', result: 'Antelope and Cats' },
   { query: '#battleship .albuquerque.denver', result: 'Aardvarks and Deer' },
   { query: '#battleship .bismarck.canberra', result: 'Bears and Coelocanths' },
   { query: '#battleship .bismarck.denver', result: 'Buffalo and Dinosaurs' },
   { query: '#battleship .canberra.denver', result: 'Chihuahuas and Dingos' },
   {
    query: '#battleship .albuquerque.bismarck.canberra',
    result: 'Anteaters, Beetles, and Capybarras',
   },
   { query: '#battleship .albuquerque.bismarck.denver', result: 'Apes, Burros, and Damselflies' },
   {
    query: '#battleship .albuquerque.canberra.denver',
    result: 'Abalone, Cheetahs, and Dragonflies',
   },
   { query: '#battleship .bismarck.canberra.denver', result: 'Basilisks, Crows, and Dogs' },
   {
    query: '#battleship .albuquerque.bismarck.canberra.denver',
    result: 'Ants, Birds, Cougars, and Dalmatians',
   },
  ],
 },
 {
  name: 'can match element with two attribute selectors',
  assertions: [
   { query: "*[colspan='2'][id=fish]", result: 'Fish' },
   { query: "*[rowspan='2'][title=mk]", result: 'Mortal Kombat' },
  ],
 },
];

if (typeof window === 'undefined') {
 module.exports = testCases;
}

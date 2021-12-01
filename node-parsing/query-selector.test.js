const { parse } = require('parse5');
const querySelector = require('./query-selector');

const html = '<!DOCTYPE html>'
  + '<html><head><title>THIS IS THE TITLE</title></head>'
  + '<body><main>THIS IS THE MAIN</main>'
  + '<div><div><div><div><div class="depth">this is the deep div early in the document</div></div></div></div></div>'
  + '<div><a>this a is in the div</a>'
  + '<p><a>this a is in the p in the div</a></p></div>'
  + '<p><span class="a">apple</span><span class="b">banana</span><span class="c">carrot</span></p>'
  + '<p><span class="d">d span</span><strong class="d">d mighty</strong><em class="d">d em</em></p>'
  + '<p class="good"><span class="good">GOODGOOD</a></p>'
  + '<p class="good"><span class="bad">GOODBAD</a></p>'
  + '<p class="bad"><span class="good">BADGOOD</a></p>'
  + '<p class="bad"><span class="bad">BADBAD</a></p>'
  + '<p id="bad"><span class="bad">id BADBAD</a><a href="google.com">a with an href</a></p>'
  + '<div class="cool-class">THIS IS THE COOL CLASS</div>'
  + '<ol><li>one</li><li>two</li><li>three</li><li>four</li><li>five</li><li>six</li><li>seven</li></ol>'
  + '<div id="an-id">I have an id.</div>'
  + '<input name="one">input name one</input>'
  + '<input name="two">input name two</input>'
  + '<input name="three">input name three</input>'
  + '<input name="four">input name four</input>'
  + '<input name="five">input name five</input>'
  + '<div class="depth">this is the shallow div late in the document</div></body></html>';
const doc = parse(html);
const text = (element) => element.childNodes.find((childNode) => childNode.nodeName === '#text')?.value;
const queryText = (query, innerText) => expect(text(querySelector(doc, query))).toBe(innerText);

test('finds main tag', () => {
  queryText('main', 'THIS IS THE MAIN');
});

test('error on empty query', () => {
  expect(() => querySelector(doc, '')).toThrow();
});

test('error on combinator prefix', () => {
  expect(() => querySelector(doc, '> body')).toThrow();
});

test('error on combinator suffix', () => {
  expect(() => querySelector(doc, '> body')).toThrow();
});

test('finds child of p', () => {
  queryText('p a', 'this a is in the p in the div');
});

test('finds child of p which is child of div', () => {
  queryText('div p a', 'this a is in the p in the div');
});

test('finds element with class cool-class', () => {
  queryText('.cool-class', 'THIS IS THE COOL CLASS');
});

test('finds span with correct class', () => {
  queryText('span.b', 'banana');
});

test('finds class d with correct tag name', () => {
  queryText('strong.d', 'd mighty');
});

test('correctly navigates relationships between class parents and children ', () => {
  queryText('.good .good', 'GOODGOOD');
  queryText('.good .bad', 'GOODBAD');
  queryText('.bad .good', 'BADGOOD');
  queryText('.bad .bad', 'BADBAD');
});

test('finds the element with an id', () => {
  queryText('#an-id', 'I have an id.');
});

test('finds the element with a class and a parent with an id', () => {
  queryText('#bad .bad', 'id BADBAD');
});

test('finds the link with the href attribute', () => {
  queryText('a[href]', 'a with an href');
});

test('finds the first matching element', () => {
  queryText('ol li', 'one');
});

test('finds the earlier element, not the shallower one', () => {
  queryText('.depth', 'this is the deep div early in the document');
});

test('null on element without child', () => {
  expect(querySelector(doc, '#an-id div')).toBe(null);
});

test('finds element with attribute exact match', () => {
  queryText('input[name=three]', 'input name three');
});

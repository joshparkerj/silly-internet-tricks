const { parse } = require('parse5');
const querySelector = require('./query-selector');

const html = '<!DOCTYPE html>'
  + '<html><head><title>THIS IS THE TITLE</title></head>'
  + '<body><main>THIS IS THE MAIN</main>'
  + '<div><a>this a is in the div</a>'
  + '<p><a>this a is in the p in the div</a></p></div>'
  + '<p><span class="a">apple</span><span class="b">banana</span><span class="c">carrot</span></p>'
  + '<p><span class="d">d span</span><strong class="d">d mighty</strong><em class="d">d em</em></p>'
  + '<p class="good"><span class="good">GOODGOOD</a></p>'
  + '<p class="good"><span class="bad">GOODBAD</a></p>'
  + '<p class="bad"><span class="good">BADGOOD</a></p>'
  + '<p class="bad"><span class="bad">BADBAD</a></p>'
  + '<div class="cool-class">THIS IS THE COOL CLASS</div>'
  + '<div id="an-id">I have an id.</div></body></html>';
const doc = parse(html);
const text = (element) => element.childNodes.find((childNode) => childNode.nodeName === '#text')?.value;

test('finds main tag', () => {
  expect(text(querySelector(doc, 'main'))).toBe('THIS IS THE MAIN');
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
  expect(text(querySelector(doc, 'p a'))).toBe('this a is in the p in the div');
});

test('finds child of p which is child of div', () => {
  expect(text(querySelector(doc, 'div p a'))).toBe('this a is in the p in the div');
});

test('finds element with class cool-class', () => {
  expect(text(querySelector(doc, '.cool-class'))).toBe('THIS IS THE COOL CLASS');
});

test('finds span with correct class', () => {
  expect(text(querySelector(doc, 'span.b'))).toBe('banana');
});

test('finds class d with correct tag name', () => {
  expect(text(querySelector(doc, 'strong.d'))).toBe('d mighty');
});

test('correctly navigates relationships between class parents and children ', () => {
  expect(text(querySelector(doc, '.good .good'))).toBe('GOODGOOD');
  expect(text(querySelector(doc, '.good .bad'))).toBe('GOODBAD');
  expect(text(querySelector(doc, '.bad .good'))).toBe('BADGOOD');
  expect(text(querySelector(doc, '.bad .bad'))).toBe('BADBAD');
});

test('finds the element with an id', () => {
  expect(text(querySelector(doc, '#an-id'))).toBe('I have an id.');
});

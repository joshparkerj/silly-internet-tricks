const { parse } = require('parse5');
const querySelector = require('./query-selector');

const html = '<!DOCTYPE html>'
  + '<html><head><title>THIS IS THE TITLE</title></head>'
  + '<body><main>THIS IS THE MAIN</main>'
  + '<div><a>this a is in the div</a>'
  + '<p><a>this a is in the p in the div</a></p></div>'
  + '<div class="cool-class">THIS IS THE COOL CLASS</div></body></html>';
const doc = parse(html);
const text = (element) => element.childNodes.find((childNode) => childNode.nodeName === '#text').value;

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

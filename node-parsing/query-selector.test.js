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
  + '<p class="good"><span class="good">GOODGOOD</span></p>'
  + '<p class="good"><span class="bad">GOODBAD</span></p>'
  + '<p class="bad"><span class="good">BADGOOD</span></p>'
  + '<p class="bad"><span class="bad">BADBAD</span></p>'
  + '<p id="bad"><span class="bad">id BADBAD</span><a href="google.com">a with an href</a></p>'
  + '<div class="cool-class">THIS IS THE COOL CLASS</div>'
  + '<ol><li>one</li><li>two</li><li>three</li><li>four</li><li>five</li><li>six</li><li>seven</li></ol>'
  + '<div id="an-id">I have an id.</div>'
  + '<label name="one">label name one</label>'
  + '<label name="two">label name two</label>'
  + '<label name="three">label name three</label>'
  + '<label name="four">label name four</label>'
  + '<label name="five">label name five</label>'
  + '<div><p>I am going to report this to the <abbr title="Federal Bureau of Investigation">FBI</abbr>'
  + ' and the <abbr title="Cental Intelligence Agency">CIA</abbr>!</p></div>'
  + '<div class="depth">this is the shallow div late in the document</div>'
  + '<footer class="end"><div><p><span class="end-inline">footer text</span></p></div></footer></body></html>';
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
  expect(() => querySelector(doc, 'body >')).toThrow();
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

test('finds descendant', () => {
  expect(text(querySelector(doc, 'footer span'))).toBe('footer text');
});

test('finds descendant with class names specified', () => {
  expect(text(querySelector(doc, 'footer.end span.end-inline'))).toBe('footer text');
});

test('correctly navigates relationships between class parents and children', () => {
  expect(text(querySelector(doc, '.good .good'))).toBe('GOODGOOD');
  expect(text(querySelector(doc, '.good .bad'))).toBe('GOODBAD');
  expect(text(querySelector(doc, '.bad .good'))).toBe('BADGOOD');
  expect(text(querySelector(doc, '.bad .bad'))).toBe('BADBAD');
});

test('finds the element with an id', () => {
  expect(text(querySelector(doc, '#an-id'))).toBe('I have an id.');
});

test('finds the element with a class and a parent with an id', () => {
  expect(text(querySelector(doc, '#bad .bad'))).toBe('id BADBAD');
});

test('finds the link with the href attribute', () => {
  expect(text(querySelector(doc, 'a[href]'))).toBe('a with an href');
});

test('finds the first matching element', () => {
  expect(text(querySelector(doc, 'ol li'))).toBe('one');
});

test('finds the earlier element, not the shallower one', () => {
  expect(text(querySelector(doc, '.depth'))).toBe('this is the deep div early in the document');
});

test('null on element without child', () => {
  expect(querySelector(doc, '#an-id div')).toBe(null);
});

test('finds element with attribute exact match', () => {
  expect(text(querySelector(doc, 'label[name=three]'))).toBe('label name three');
});

test('finds element with attribute word match', () => {
  expect(text(querySelector(doc, 'abbr[title~=Federal]'))).toBe('FBI');
});

test('finds element with attribute word match even without closing square bracket', () => {
  // in Chrome, the document.querySelector works the same without the closing square bracket
  expect(text(querySelector(doc, 'abbr[title~=Federal'))).toBe('FBI');
});

test('finds element with attribute prefix match', () => {
  expect(text(querySelector(doc, 'abbr[title^=Fed]'))).toBe('FBI');
});

test('finds element with attribute suffix match', () => {
  expect(text(querySelector(doc, 'abbr[title$=cy]'))).toBe('CIA');
});

test('finds element with attribute contains match', () => {
  expect(text(querySelector(doc, 'abbr[title*=lig]'))).toBe('CIA');
});

test('works with shouty tag names', () => {
  expect(text(querySelector(doc, 'DIV P ABBR[title^=Fed]'))).toBe('FBI');
});

test('can match attribute without tagname', () => {
  expect(text(querySelector(doc, '[title^=Fed]'))).toBe('FBI');
});

test('can match attribute with universal selector', () => {
  expect(text(querySelector(doc, '*[title^=Fed]'))).toBe('FBI');
});

test('can match descendant with universal selector', () => {
  expect(text(querySelector(doc, 'head *'))).toBe('THIS IS THE TITLE');
});

test('can match child attribute without tagname', () => {
  expect(text(querySelector(doc, 'DIV P [title^=Fed]'))).toBe('FBI');
});

test('can match descendant attribute without tagname', () => {
  expect(text(querySelector(doc, 'DIV [title^=Fed]'))).toBe('FBI');
});

test('does not match descendent when using child combinator', () => {
  expect(querySelector(doc, 'DIV > [title^=Fed]')).toBe(null);
});

test('matches child when using child combinator', () => {
  expect(text(querySelector(doc, 'DIV > P > [title^=Fed]'))).toBe('FBI');
});

test('matches sibling when using general sibling combinator', () => {
  expect(text(querySelector(doc, '[title^=Fed] ~ *'))).toBe('CIA');
});

test('matches immediate sibling when using adjacent sibling combinator', () => {
  expect(text(querySelector(doc, '[name=three] + *'))).toBe('label name four');
});

test('matches immediate sibling by attribute when using adjacent sibling combinator', () => {
  expect(text(querySelector(doc, '[name=three] + [name=four]'))).toBe('label name four');
});

test('does not match non-immediate sibling when using adjacent sibling combinator', () => {
  expect(querySelector(doc, '[name=three] + [name=five]')).toBe(null);
});

test('matches non-immediate sibling when using general sibling combinator', () => {
  expect(text(querySelector(doc, '[name=three] ~ [name=five]'))).toBe('label name five');
});

test('does not match child or descendent when using sibling combinators', () => {
  expect(querySelector(doc, 'p.good + span.good')).toBe(null);
  expect(querySelector(doc, 'p.good ~ span.good')).toBe(null);
  expect(querySelector(doc, 'footer.end + span.end-inline')).toBe(null);
  expect(querySelector(doc, 'footer.end ~ span.end-inline')).toBe(null);
});

test('can use selector list', () => {
  expect(text(querySelector(doc, 'p span    ,  p a'))).toBe('this a is in the p in the div');
  expect(text(querySelector(doc, 'p a    ,  p span'))).toBe('this a is in the p in the div');
});

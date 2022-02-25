const { parse } = require('parse5');
const { readFileSync } = require('fs');
const querySelector = require('./query-selector');

const testCases = require('./query-selector-tests');

const html = readFileSync('./node-parsing/query-selector-browser.html', 'utf8');

const doc = parse(html);
const text = (element) => {
  const childNode = element.childNodes.find((cn) => cn.nodeName === '#text');
  return childNode && childNode.value;
};

testCases.forEach(({ name, assertions }) => {
  test(name, () => {
    assertions.forEach(({ query, result }) => {
      if (typeof result === 'string') {
        expect(text(querySelector(doc, query))).toBe(result);
      } else if (result === null) {
        expect(querySelector(doc, query)).toBe(null);
      } else if (result === undefined) {
        expect(() => querySelector(doc, query)).toThrow();
      }
    });
  });
});

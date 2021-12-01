const { parse } = require('parse5');
const { test, expect } = require('jest');
const querySelector = require('./query-selector');

test('finds body tag', () => {
  const html = '<!DOCTYPE html><html><head><title>THIS IS THE TITLE</title></head><body>THIS IS THE BODY</body></html>';
  const doc = parse(html);
  expect(querySelector(doc, 'body').childNodes.find((childNode) => childNode.nodeName === '#text').value.toBe('THIS IS THE BODY'));
});

const fetch = require('node-fetch');
const { parse } = require('parse5');

const getDescendantByTag = (node, tag) => {
  for (let i = 0; i < node.childNodes?.length; i++) {
    if (node.childNodes[i].tagName === tag) return node.childNodes[i];

    const result = getDescendantByTag(node.childNodes[i], tag);
    if (result) return result;
  }

  return null;
};

fetch('https://google.com', { redirect: 'manual' })
  .then((response) => response.text())
  .then((text) => {
    console.log(text);
    const dom = parse(text);
    console.log(getDescendantByTag(dom, 'title'));
    console.log(getDescendantByTag(dom, 'span'));
    console.log(getDescendantByTag(dom, 'a'));
    console.log(getDescendantByTag(dom, 'div'));
  });

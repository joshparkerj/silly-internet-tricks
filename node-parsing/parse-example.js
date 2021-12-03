import fetch from 'node-fetch';
import { parse } from 'parse5';

const getDescendantByTagName = (node, tagName) => {
  for (let i = 0; i < node.childNodes.length; i++) {

    
  }
};

fetch('https://google.com', { redirect: 'manual' })
  .then((response) => response.text())
  .then((text) => parse(text))
  .then((dom) => console.log(getDescendantByTagName(dom, 'title')));

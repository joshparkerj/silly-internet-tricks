/* eslint-disable no-unused-vars */
const fetch = require('node-fetch');
const { parse } = require('parse5');

const getDescendant = (node, predicate) => {
 for (let i = 0; i < node.childNodes?.length; i++) {
  if (predicate(node.childNodes[i])) return node.childNodes[i];

  const result = getDescendant(node.childNodes[i], predicate);
  if (result) return result;
 }

 return null;
};

const getChild = (node, predicate) => {
 for (let i = 0; i < node.childNodes?.length; i++) {
  if (predicate(node.childNodes[i])) return node.childNodes;
 }

 return null;
};

const getFollowingSibling = (node, predicate) => {
 for (let i = 0, foundNode = false; i < node.parentNode?.childNodes?.length; i++) {
  if (foundNode) {
   if (predicate(node.parentNode.childNodes[i])) return node.childNodes;
  } else if (node.parentNode.childNodes[i] === node) {
   foundNode = true;
  }
 }

 return null;
};

const getDescendantByTag = (node, tag) => (
 getDescendant(node, (childNode) => childNode.tagName === tag)
);

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

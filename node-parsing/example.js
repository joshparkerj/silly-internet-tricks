const { request } = require('https');
const { parse } = require('parse5');

const url = 'https://en.wikipedia.org/wiki/Hygge';
const urlPattern = /^(?<protocol>https?:)\/\/(?<host>[^/]+)(?<path>\/.*)$/;
const urlMatch = url.match(urlPattern);
const { protocol, host, path } = urlMatch.groups;

const followingSiblings = function followingSiblings(node) {
  const allSiblings = node.parentNode.childNodes;
  const elementSiblings = allSiblings.filter((siblingNode) => siblingNode.nodeName.match(/^[^#]/));
  const nodeIndex = elementSiblings.findIndex((elementSibling) => elementSibling === node);
  return elementSiblings.slice(nodeIndex + 1);
};

const callback = (r) => {
  const chunks = [];

  r.on('error', () => console.error('got error'));
  r.on('data', (chunk) => { chunks.push(chunk); });
  r.on('end', () => {
    const textHtml = chunks.join('');
    const doc = parse(textHtml);
    // console.log(doc);
    const html = doc.childNodes.find((node) => node.tagName === 'html');
    // console.log(html);
    const body = html.childNodes.find((node) => node.tagName === 'body');
    // console.log(body);
    const footer = body.childNodes.find((node) => node.tagName === 'footer');
    // console.log(footer);
    const footerPlaces = footer.childNodes.find((node) => node.attrs?.find((attr) => attr.name === 'id' && attr.value === 'footer-places'));
    // console.log(footerPlaces);
    const developers = footerPlaces.childNodes.find((node) => node.attrs?.find((attr) => attr.name === 'id' && attr.value === 'footer-places-developers'));
    // console.log(developers);
    // const developersLink = developers.childNodes.find((node) => node.tagName === 'a');
    // console.log(developersLink);
    console.log(developers.parentNode === footerPlaces);
    // console.log(developersLink.parentNode.childNodes);
    // console.log(developersLink.parentNode.childNodes.length);
    for (let i = 0; i < developers.parentNode.childNodes.length; i += 1) {
      const siblingNode = developers.parentNode.childNodes[i];
      if (siblingNode.nodeName !== '#text') {
        console.log(siblingNode.nodeName, siblingNode.attrs);
        if (siblingNode === developers) {
          console.log('this is me!');
        }
      }
    }

    console.log('let\'s see the following siblings');

    const fs = followingSiblings(developers);
    for (let i = 0; i < fs.length; i += 1) {
      console.log(fs[i].nodeName, fs[i].attrs);
    }
  });
};

request({ protocol, host, path }, callback).end();

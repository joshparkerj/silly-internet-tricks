/* an attempt to create my own implementation of querySelector for practice */

const querySelectorHelper = function querySelectorHelper(node, query) {
  if (!query) {
    return node;
  }

  const selectorList = query.trim().split(',');
  const childNodes = node.childNodes.filter((childNode) => childNode.nodeName.match(/^[^#]/));

  if (childNodes.length === 0) {
    return null;
  }

  for (let i = 0; i < selectorList.length; i += 1) {
    const selector = selectorList[i];
    const { /* combinator, */ elementSelector, rest } = selector.toLocaleLowerCase().trim().match(/^(?<combinator>[>~+])?\s?(?<elementSelector>[^\s+>~]+)(?<rest>[\s+>~].*)?$/).groups;

    const tagMatch = elementSelector.match(/^[^.#[]+/);
    const tag = tagMatch && tagMatch[0];
    console.log(tag);
    // const classes = elementSelector.match(/\.[^.#\[]+/g);
    // const id = elementSelector.match(/#[^.#\[]+/);
    // const attrs = elementSelector.match(/\[[^\]]+\]/g);

    // const matchingChildren = childNodes.filter((childNode) => {
    //   if (tag && tag !== '*') {

    //   }
    // })

    if (!tag || tag === '*') {
      console.log('no tag');
      const result = querySelectorHelper(childNodes[0], rest);
      if (result) {
        return result;
      }
    } else {
      const matchingTags = childNodes.filter((childNode) => childNode.tagName === tag);
      console.log(matchingTags);
      for (let j = 0; j < matchingTags.length; j += 1) {
        const result = querySelectorHelper(matchingTags[j], rest);
        if (result) {
          return result;
        }
      }
    }

    for (let j = 0; j < childNodes.length; j += 1) {
      const result = querySelectorHelper(childNodes[j], query);
      if (result) {
        return result;
      }
    }
    // if (first.match(/^[a-z]/)) {
    //   if (first);
    // }

    // querySelector(rest);
  }

  return null;
};

module.exports = function querySelector(node, query) {
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    throw new Error('The provided selector is empty.');
  }

  if (trimmed.match(/^[>~+]/) || trimmed.match(/[>~+]$/)) {
    throw new Error('not a valid selector.');
  }

  const result = querySelectorHelper(node, query);
  console.log(result);
  console.log(result.childNodes);
  console.log(result.childNodes.map((e) => e.nodeName));
  console.log(result.childNodes.find((childNode) => childNode.nodeName === '#text'));
  return result;
};

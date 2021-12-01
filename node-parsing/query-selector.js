/* an attempt to create my own implementation of querySelector for practice */

const querySelectorHelper = function querySelectorHelper(node, query) {
  const selectorList = query.trim().split(',');
  if (selectorList.length === 0) {
    return node;
  }

  const childNodes = node.childNodes.filter((childNode) => childNode.nodeName.match(/^[^#]/));

  if (childNodes.length === 0) {
    return null;
  }

  for (let i = 0; i < selectorList.length; i += 1) {
    const selector = selectorList[i];
    const { first, rest } = selector.toLocaleLowerCase().trim().match(/^(?<first>[^\s+>~]+)(?<rest>[\s+>~].*)$/).groups;

    const tag = first.match(/^[^.#\[]+/);
    const classes = first.match(/\.[^.#\[]+/g);
    const id = first.match(/#[^.#\[]+/);
    const attrs = first.match(/\[[^\]]+\]/g);
    if (tag === '*') {
      const result = querySelectorHelper(childNodes[0], rest);
      if (result) {
        return result;
      }
    }



    if (first.match(/^[a-z]/)) {
      if (first)
    }

    // querySelector(rest);
    return null;
  }
};

module.exports = function querySelector(node, query) {
  if (query.trim().length === 0) {
    throw new Error('The provided selector is empty.');
  }

  return querySelectorHelper(node, query);
};

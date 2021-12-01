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
    const { elementSelector, rest } = selector.toLocaleLowerCase().trim().match(/^(?<combinator>[>~+])?\s?(?<elementSelector>[^\s+>~]+)(?<rest>[\s+>~].*)?$/).groups;

    const tagMatch = elementSelector.match(/^[^.#[]+/);
    const tag = tagMatch && tagMatch[0];

    if (!tag || tag === '*') {
      const result = querySelectorHelper(childNodes[0], rest);
      if (result) {
        return result;
      }
    } else {
      const matchingTags = childNodes.filter((childNode) => childNode.tagName === tag);
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
  return result;
};

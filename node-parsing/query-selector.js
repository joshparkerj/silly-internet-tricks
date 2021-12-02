const attributeMatcher = function attributeMatcher(actualValues, operator, targetValue) {
  switch (operator) {
    case '=':
      return actualValues.some((actualValue) => actualValue === targetValue);
    case '~=': {
      const re = new RegExp(`\\b${targetValue}\\b`);
      return actualValues.some((actualValue) => actualValue.match(re));
    }
    case '|=':
      throw new Error('not implemented');
    case '^=':
      return actualValues.some((actualValue) => actualValue.startsWith(targetValue));
    case '$=':
      return actualValues.some((actualValue) => actualValue.endsWith(targetValue));
    case '*=':
      return actualValues.some((actualValue) => actualValue.includes(targetValue));
    default:
      throw new Error('not a valid selector');
  }
};

const followingSiblings = function followingSiblings(node) {
  const allSiblings = node.parentNode.childNodes;
  const elementSiblings = allSiblings.filter((siblingNode) => siblingNode.nodeName.match(/^[^#]/));
  const nodeIndex = elementSiblings.findIndex((elementSibling) => elementSibling === node);
  return elementSiblings.slice(nodeIndex + 1);
};

const getElementMatcher = function getElementMatcher(elementSelector) {
  const filters = [];
  const tag = elementSelector.match(/^[^.#[]+/);
  if (tag && tag[0] !== '*') {
    const lowerTag = tag[0].toLocaleLowerCase();
    filters.push((childNode) => childNode.tagName === lowerTag);
  }

  const classes = elementSelector.match(/\.[^.#[]+/g);
  if (classes) {
    filters.push((childNode) => (classes.every((className) => {
      const { attrs } = childNode;
      const classList = attrs?.find(({ name }) => name === 'class')?.value.split(' ');
      return classList?.includes(className.replace('.', ''));
    })));
  }

  const id = elementSelector.match(/#[^.#[]+/);
  if (id) {
    filters.push((childNode) => childNode.attrs?.find(({ name, value }) => name === 'id' && value === id[0].replace('#', '')));
  }

  const attributeSelectors = elementSelector.match(/\[[^\]]+\]?/g);
  if (attributeSelectors) {
    filters.push((childNode) => (attributeSelectors.every((attributeSelector) => {
      const attributeContent = attributeSelector.replace(/(\[|\])/g, '');
      const attributeMatch = attributeContent.match(/^(?<attr>[\w-]+)\s*(?<operator>[~|^$*]?=)?\s*(?<attrValue>"[^"]*"|'[^']*'|[\w-]+)?$/);
      const { attr, operator, attrValue } = attributeMatch.groups;
      if (!operator && !attrValue) {
        return childNode.attrs?.some(({ name }) => name === attr);
      }

      if (operator && attrValue) {
        const attributeValues = childNode.attrs
          ?.filter(({ name }) => name === attr)
          .map(({ value }) => value);

        return attributeMatcher(attributeValues, operator, attrValue);
      }

      throw new Error(`${attributeSelector} is not a valid attribute selector.`);
    })));
  }

  return function elementMatcher(childNode) {
    return filters.every((filter) => filter(childNode));
  };
};

const querySelectorHelper = function querySelectorHelper(node, query) {
  if (!query) {
    return node;
  }

  const selectorList = query.trim().split(',');

  for (let i = 0; i < selectorList.length; i += 1) {
    const selector = selectorList[i];
    const { combinator, elementSelector, rest } = selector.trim().match(/^(?<combinator>[>~+])?\s?(?<elementSelector>(\[[^\]]+\]?|[^\s+>~])+)(?<rest>[\s+>~].*)?$/).groups;
    let searchNodes;
    if (!combinator || combinator === '>') {
      searchNodes = node.childNodes.filter((childNode) => childNode.nodeName.match(/^[^#]/));
    } else if (combinator === '~') {
      searchNodes = followingSiblings(node);
    } else if (combinator === '+') {
      searchNodes = [followingSiblings(node)[0]];
    } else {
      throw new Error('unknown combinator');
    }

    const elementMatcher = getElementMatcher(elementSelector);
    for (let j = 0; j < searchNodes.length; j += 1) {
      const searchNode = searchNodes[j];

      if (elementMatcher(searchNode)) {
        const result = querySelectorHelper(searchNode, rest);
        if (result) {
          return result;
        }
      }

      if (!combinator) {
        const result = querySelectorHelper(searchNode, query);
        if (result) {
          return result;
        }
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

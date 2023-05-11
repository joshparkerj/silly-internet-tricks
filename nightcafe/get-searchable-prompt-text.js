export default function getSearchablePromptText(dom) {
  const selector = '#__next [itemprop=mainEntity] .css-1gzn9ne > .css-ntik0p > .css-q8r9lz';
  const descriptiveElement = dom.querySelector(selector);

  if (!descriptiveElement) throw new Error('No descriptive element found');

  descriptiveElement.querySelectorAll('style').forEach((styleElement) => {
    styleElement.parentNode.removeChild(styleElement);
  });

  const textPrompts = descriptiveElement.textContent.match(/"[^"]*/g)
    .filter((t) => !t.includes('weight')).map((t) => t.slice(1))
    .reduce((acc, e) => acc + e, '');

  const searchableText = textPrompts.normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\s\w\d]+/g, '');

  return searchableText;
}

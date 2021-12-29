const searchAllStylesheets = function searchAllStylesheets(searchTerm) {
  const constructorName = searchTerm.constructor.name;
  const rules = [];
  const styleSheets = [...document.styleSheets];
  styleSheets.forEach((styleSheet) => {
    try {
      const { cssRules } = styleSheet;
      [...cssRules].forEach(({ cssText }) => {
        if ((constructorName === 'String' && cssText.includes(searchTerm))
          || (constructorName === 'RegExp' && cssText.match(searchTerm))) {
          rules.push(cssText);
        }
      });
    } catch (e) {
      console.error(e);
      console.log('no css rules on ', styleSheet);
    }
  });

  return rules;
};

module.exports = searchAllStylesheets;

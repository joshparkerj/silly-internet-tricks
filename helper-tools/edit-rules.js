const editRules = function editRules(searchTerm, replaceTerm) {
  if (searchTerm.constructor.name !== 'String' || replaceTerm.constructor.name !== 'String') {
    throw new Error('string terms only');
  }

  const styleSheets = [...document.styleSheets];
  styleSheets.forEach((styleSheet, ssi) => {
    try {
      const cssRules = [...styleSheet.cssRules];
      cssRules.forEach((cssRule, cri) => {
        const { cssText } = cssRule;
        if (cssText.includes(searchTerm)) {
          const editedText = cssText.replace(searchTerm, replaceTerm);
          document.styleSheets[ssi].deleteRule(cri);
          document.styleSheets[ssi].insertRule(editedText);
        }
      });
    } catch (e) {
      console.error(e);
      console.log('could not access css rules on styleSheet, ', styleSheet);
    }
  });
};

module.exports = editRules;

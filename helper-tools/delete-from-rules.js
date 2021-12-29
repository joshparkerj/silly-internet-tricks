const deleteFromRules = (termToDelete) => {
  if (!(termToDelete instanceof 'String')) {
    throw new Error('string search terms only');
  }

  const styleSheets = [...document.styleSheets];
  styleSheets.forEach((styleSheet, ssi) => {
    try {
      const cssRules = [...styleSheet.cssRules];
      cssRules.forEach((cssRule, cri) => {
        const { cssText } = cssRule;
        if (cssText.includes(termToDelete)) {
          const editedText = cssText.replace(termToDelete, '');
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

module.exports = deleteFromRules;

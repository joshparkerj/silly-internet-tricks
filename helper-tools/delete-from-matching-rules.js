const deleteFromMatchingRules = (termToDelete) => {
 let re;
 if (termToDelete instanceof String) {
  re = new RegExp(termToDelete);
 } else {
  re = termToDelete;
 }

 const styleSheets = [...document.styleSheets];
 styleSheets.forEach((styleSheet, ssi) => {
  try {
   const cssRules = [...styleSheet.cssRules];
   cssRules.forEach((cssRule, cri) => {
    const { cssText } = cssRule;
    if (cssText.match(re)) {
     document.styleSheets[ssi].deleteRule(cri);
    }
   });
  } catch (e) {
   console.error(e);
   console.log('could not access css rules on styleSheet, ', styleSheet);
  }
 });
};

module.exports = deleteFromMatchingRules;

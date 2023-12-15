const deleteRules = (selector, ruleName) => {
 const styleSheets = [...document.styleSheets];
 styleSheets.forEach((styleSheet, ssi) => {
  const cssRules = [...styleSheet.cssRules];
  cssRules.forEach((cssRule, cri) => {
   const { cssText } = cssRule;
   const selectorRE = new RegExp(`${selector}.*\\{`, 'i');
   if (cssText.match(selectorRE)) {
    const rulesRE = /\{(.*)\}/;
    const rulesText = cssText.match(rulesRE)[1].trim();
    const ruleRE = /[^;]*;/g;
    const rules = rulesText.match(ruleRE);
    rules.forEach((rule) => {
     const ruleNameRE = new RegExp(`^${ruleName}:`, 'i');
     if (rule.match(ruleNameRE)) {
      document.styleSheets[ssi].deleteRule(cri);
     }
    });
   }
  });
 });
};

module.exports = deleteRules;

// ==UserScript==
// @name         Smashing smaller text.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Smashing Magazine text size is ENORMOUS, so I try to make it more reasonable.
// @author       Josh Parker
// @match        https://www.smashingmagazine.com/*
// @icon         https://www.google.com/s2/favicons?domain=smashingmagazine.com
// @grant        none
// ==/UserScript==

(function smashingSmallerText() {
  const styleSheets = [...document.styleSheets];

  // delete rules is meant to be reusable across many userscripts
  const deleteRules = (selector, ruleName) => {
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

  deleteRules('body', 'font-size');
  document.styleSheets[0].insertRule('body { font-size: 15px; }');
}());

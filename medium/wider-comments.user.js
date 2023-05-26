// ==UserScript==
// @name         Wider Comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to fix the very narrow comments section on medium
// @author       You
// @match        https://themakingofamillionaire.com/*
// @icon         https://www.google.com/s2/favicons?domain=themakingofamillionaire.com
// @grant        none
// ==/UserScript==

(function widerComments() {
 const searchAllStylesheets = function searchAllStylesheets(searchTerm) {
  const constructorName = searchTerm.constructor.name;
  const rules = [];
  const styleSheets = [...document.styleSheets];
  styleSheets.forEach((styleSheet) => {
   try {
    const { cssRules } = styleSheet;
    [...cssRules].forEach(({ cssText }) => {
     if (
      (constructorName === 'String' && cssText.includes(searchTerm))
      || (constructorName === 'RegExp' && cssText.match(searchTerm))
     ) {
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

 console.log(searchAllStylesheets('414px'));

 // '.lj { width: 414px; }';
 const editRules = function editRules(rule, newRule) {
  if (rule.constructor.name !== 'String' || newRule.constructor.name !== 'String') {
   throw new Error('string terms only');
  }

  const styleSheets = [...document.styleSheets];
  styleSheets.forEach((styleSheet, ssi) => {
   try {
    const cssRules = [...styleSheet.cssRules];
    cssRules.forEach((cssRule, cri) => {
     const { cssText } = cssRule;
     if (cssText.includes(rule)) {
      const editedText = cssText.replace(rule, newRule);
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

 const fixWidth = function fixWidth() {
  const originalRule = '.lj { width: 414px; }';
  // const transformedRule = '.aes { transform: translateX(-414px); }';
  // const zxRule = '.zx { transform: translateX(-414px); }';
  const rules = searchAllStylesheets(originalRule);
  const translateRules = searchAllStylesheets('transform: translateX(-414px');
  if (rules.length > 0 && translateRules.length > 0) {
   console.log(rules);
   console.log(translateRules);
   editRules(rules[0], rules[0].replace('414px', '50vw'));
   editRules(translateRules[0], translateRules[0].replace('414px', '50vw'));

   document
    .querySelectorAll('section.dt.gm.gn.do.go')
    .forEach((e) => e.style.setProperty('width', '50vw'));
   document.styleSheets[1].insertRule(
    '.n.p > .av.aw.ax.ay.az.ba.bb.w { width: fit-content; left: 0; position: absolute; }',
   );
  } else {
   setTimeout(fixWidth, 2000);
  }
 };

 fixWidth();
}());

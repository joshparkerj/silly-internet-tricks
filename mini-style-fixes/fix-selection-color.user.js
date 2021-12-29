// ==UserScript==
// @name         fix selection color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The selection color is whiteish and I thought it wasn't selecting at all. Oops.
// @author       Josh Parker
// @match        https://www.blunt-therapy.com/*
// @icon         https://www.google.com/s2/favicons?domain=blunt-therapy.com
// @grant        none
// ==/UserScript==

(function fixSelectionColor() {
  const editRules = function editRules(searchTerm, replaceTerm) {
    if (!(searchTerm instanceof 'String' || replaceTerm instanceof 'String')) {
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

  editRules('::selection { background: rgb(251, 251, 255); }', '::selection { background: blue; color: white; }');
}());

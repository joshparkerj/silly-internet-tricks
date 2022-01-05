// ==UserScript==
// @name         Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  pub med dark mode
// @author       Josh Parker
// @match        https://www.ncbi.nlm.nih.gov/pmc/
// @match        https://www.ncbi.nlm.nih.gov/pmc/*
// @icon         https://www.google.com/s2/favicons?domain=nih.gov
// @grant        none
// ==/UserScript==

(function darkMode() {
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

  const deleteFromMatchingRules = (termToDelete) => {
    let re;
    if (termToDelete instanceof String) {
      re = new RegExp(termToDelete);
    } else {
      re = termToDelete;
    }

    const styleSheets = [...document.styleSheets];
    for (let ssi = styleSheets.length - 1; ssi >= 0; ssi--) {
      const styleSheet = styleSheets[ssi];
      try {
        const cssRules = [...styleSheet.cssRules];
        for (let cri = cssRules.length - 1; cri >= 0; cri--) {
          const cssRule = cssRules[cri];
          const { cssText } = cssRule;
          if (cssText.match(re)) {
            document.styleSheets[ssi].deleteRule(cri);
          }
        }
      } catch (e) {
        console.error(e);
        console.log('could not access css rules on styleSheet, ', styleSheet);
      }
    }
  };

  editRules('#ccc', '#000');
  console.log(searchAllStylesheets('background-color'));
  deleteFromMatchingRules('background-color');
  const selectors = [
    'body#ui-ncbiexternallink-3',
    '#ui-ncbiexternallink-3 > .grid > .col',
    '#maincontent #mc',
    '#ajax-portlets div',
    '#ajax-portlets div .one_line_source',
    '#ajax-portlets div.portlet ul > li.two_line .one_line_source, #ajax-portlets div.portlet ul > li.two_line .source',
    '.bottom #footer, .bottom .contact_info',
  ];

  document.styleSheets[0].insertRule(`${selectors.join(', ')} { color: white; background-color: black; }`);
  document.styleSheets[0].insertRule('.page .content a[href] { color: #BBF;}');
  document.styleSheets[0].insertRule('.bottom #footer a[href] { color: #BBF;}');
  document.styleSheets[0].insertRule('div.footer#footer { background: black; }');
  document.styleSheets[0].insertRule('#footer ul > li > h3, #maincontent #mc h3, #maincontent #mc h2, #ajax-portlets .portlet h3 { color: #FDB; }');
  document.styleSheets[0].insertRule('#maincontent #mc #pmclinksbox, .page .top .ncbi-alerts .ncbi-alert__shutdown-outer { background-color: #990; }');
}());

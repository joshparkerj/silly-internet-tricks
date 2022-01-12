// ==UserScript==
// @name         Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  pub med dark mode
// @author       Josh Parker
// @match        https://www.ncbi.nlm.nih.gov/pmc/
// @match        https://www.ncbi.nlm.nih.gov/pmc/*
// @match        https://pubmed.ncbi.nlm.nih.gov/*
// @icon         https://www.google.com/s2/favicons?domain=nih.gov
// @grant        none
// ==/UserScript==

(function darkMode() {
  const addRule = (rule) => document.styleSheets[0].insertRule(rule);

  const maincontentSelectors = [
    'html > body',
    'html > body div.article-page#article-page',
    '#maincontent #mc',
    '#maincontent #mc div.table-wrap',
    'body#ui-ncbiexternallink-3',
    '#ui-ncbiexternallink-3 > .grid > .col',
    '.bottom #footer',
    '.bottom .contact_info',
    '#ajax-portlets div',
    '#ajax-portlets div .one_line_source',
    '#ajax-portlets div.portlet ul > li.two_line .one_line_source',
    '#ajax-portlets div.portlet ul > li.two_line .source',
    '#ajax-portlets div.portlet ul li.expanded.highlight',
    '.page .content #rightcolumn',
    '.page > .content > .container > .col',
  ];

  addRule(`${maincontentSelectors.join(', ')} { color: white; background-color: black; }`);

  const boxSelectors = [
    '#maincontent #mc #pmclinksbox',
    '.page .top .ncbi-alerts .ncbi-alert__shutdown-outer',
    '#maincontent #mc div.iconblock',
    '#maincontent #mc div.iconblock .icnblk_cntnt',
  ];

  addRule(`${boxSelectors.join(', ')} { color: white; background-color: #990; }`);
  addRule(`${boxSelectors.map((bs) => `${bs} a`).join(', ')} { color: #CFF; }`);

  const dropdownSelectors = [
    '#maincontent #mc .ui-ncbilinksmenu',
    '#maincontent #mc .ui-ncbilinksmenu .oneLevel li a',
    '#maincontent #mc .ui-ncbilinksmenu .ui-ncbibasicmenu li a',
  ];

  addRule(`${dropdownSelectors.join(', ')} { background: #222; box-shadow: 0 0 1em 1em #666; }`);

  const miscRules = [
    '.bottom #footer a[href], .page .content a[href] { color: #BBF; }',
    'div.footer#footer { background: black; }',
    '#footer ul > li > h3, #maincontent #mc h3, #maincontent #mc h4, #maincontent #mc h2, #ajax-portlets .portlet h3 { color: #FDB; }',
    '#maincontent #mc h1 { color: white; }',
    '#maincontent #mc div.table-wrap { border: 2px solid white; }',
    '#ajax-portlets div.pmc_para_cit { border: none; border-top: 1px solid white; }',
    '#ajax-portlets .portlet { border-top: .4em solid #97b0c8; }',
    '.page .content #rightcolumn .share-buttons a, .page .content #rightcolumn .format-menu ul li.selected { color: #bbb; }',
    '.page .content .ncbi-alerts .pmc-labs-ad-outer { background-color: #055; }',
  ];

  miscRules.forEach((rule) => addRule(rule));
}());

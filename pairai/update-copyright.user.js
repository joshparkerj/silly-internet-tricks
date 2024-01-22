// ==UserScript==
// @name         update copyright for pairai
// @description  update copyright for pairai
// @namespace    http://tampermonkey.net/
// @version      2024-01-22
// @match        https://pairai.com/
// ==/UserScript==
(function updateCopyright() {
 const mutationObserver = new MutationObserver(() => {
  const copyrightElement = document.querySelector('[data-framer-name=links]').parentElement.children[0].querySelector('p');
  const updatedText = copyrightElement.textContent.replace('2023', '2024');
  copyrightElement.textContent = updatedText;
 });

 mutationObserver.observe(document.querySelector('#main'), { childList: true, subtree: true });
}());

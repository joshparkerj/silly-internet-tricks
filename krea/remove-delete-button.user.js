// ==UserScript==
// @name         Remove Delete Button
// @namespace    http://tampermonkey.net/
// @version      2024-01-10
// @description  Avoid accidentally deleting enhanced images by removing the delete buttons entirely
// @author       Josh Parker
// @match        https://krea.ai/apps/image/enhancer
// @match        https://*.krea.ai/apps/image/enhancer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=krea.ai
// @grant        none
// ==/UserScript==

(function removeDeleteButton() {
 const style = document.createElement('style');
 style.appendChild(new Text('button.absolute[type=submit] { display: none }'));
 document.body.appendChild(style);
}());

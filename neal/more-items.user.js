// ==UserScript==
// @name         More Items
// @namespace    http://tampermonkey.net/
// @version      2024-03-08
// @description  Show way more items on screen in Infinite Craft
// @author       Josh Parker
// @match        https://neal.fun/infinite-craft/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neal.fun
// @grant        none
// ==/UserScript==

(function moreItems() {
 const style = document.createElement('style');
 style.appendChild(new Text(`
div.container > canvas + div.sidebar {
 width: 100vw;
}

div.container > canvas + div.sidebar > div.sidebar-inner > div.items {
 max-width: 100%;
}

div.container > canvas + div.sidebar > div.sidebar-inner > div.items > div.item {
 margin: 0;
}
`));

 document.body.appendChild(style);
}());

// ==UserScript==
// @name         No hot network questions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  reduce distractions on stackoverflow
// @author       Josh Parker
// @match        https://stackoverflow.com/questions/*
// @match        https://*.stackexchange.com/questions/*
// @match        https://serverfault.com/questions/*
// @match        https://superuser.com/questions/*
// @match        https://askubuntu.com/questions/*
// @icon         https://www.google.com/s2/favicons?domain=stackoverflow.com
// @grant        none
// ==/UserScript==

import remove from './remove';

(function noHotNetwork() {
  remove('#hot-network-questions');
  remove('.s-sidebarwidget');
}());

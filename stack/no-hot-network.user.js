// ==UserScript==
// @name         No hot network questions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  reduce distractions on stackoverflow
// @author       Josh Parker
// @source       https://github.com/joshparkerj/silly-internet-tricks/blob/main/stack/no-hot-network.user.js
// @downloadURL  https://gist.github.com/joshparkerj/7b44a4258c3bfc7927ca677652c5aaff/raw/b4c971006b884e63fa667d5423c09fc49d716a2f/no-hot-network-questions.user.js
// @updateURL    https://gist.github.com/joshparkerj/7b44a4258c3bfc7927ca677652c5aaff/raw/b4c971006b884e63fa667d5423c09fc49d716a2f/no-hot-network-questions.meta.js
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

// ==UserScript==
// @name         Washington Post better colors
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       You
// @match        https://www.washingtonpost.com/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const bodyElement = [...document.getElementsByTagName('body')][0];

  bodyElement.style.setProperty('text-shadow', 'rgb(127 204 102) 1px 1px 1px, rgb(204 102 127) -1px -1px 1px');
  bodyElement.style.setProperty('background-image', 'linear-gradient(45deg, #33ccff, #cc33ff)');

  const commentsWrapper = document.querySelector('main article > #comments-wrapper');

  const commentsWrapperObserver = new MutationObserver((mutationsList, observer) => {
    const commentsIframe = commentsWrapper.querySelector('iframe');
    if (commentsIframe) {
      const commentsIframeObserver = new MutationObserver((commentsIframeMutationsList, ciObserver) => {
        const commentsDocument = commentsIframe.contentDocument;
        if (commentsDocument) {

          const commentsBodyElement = commentsDocument.querySelector('body');

          commentsBodyElement.style.setProperty('text-shadow', 'rgb(127 204 102) 1px 1px 1px, rgb(204 102 127) -1px -1px 1px');
          commentsBodyElement.style.setProperty('background-image', 'linear-gradient(45deg, #33ccff, #cc33ff)');
          ciObserver.disconnect();
        }
      });

      commentsIframeObserver.observe(commentsIframe, { attributes: true });
      observer.disconnect();
    }
  });

  commentsWrapperObserver.observe(commentsWrapper, { childList: true });
})();

// ==UserScript==
// @name         Restyled goodreads reviews
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try splashing reviews all across four columns
// @author       Josh Parker
// @match        https://www.goodreads.com/book/show/*
// @icon         https://www.google.com/s2/favicons?domain=goodreads.com
// @grant        none
// ==/UserScript==

(function restyledReviews() {
 const css = `
div#lazy_loadable_view {
  position: absolute;
  top: 80rem;
  left: 0rem;
  right: 0rem;
  padding: 1rem;
}

.rightContainer {
  position: absolute;
  float: none;
  display: flex;
  top: 44rem;
  width: 82%;
  left: 21rem;
  justify-content: space-around;
}

.bookCarousel ul {
  display: grid;
  width: fit-content;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;
}

.bookCarousel {
  height: 26rem;
  width: 52rem;
}

.rightContainer > div {
  margin: 1rem;
}

div[data-react-class$=GoogleBannerAd], div[data-react-class$=GoogleFeaturedContentModule] {
  display: none;
}

div#bookReviews {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

div#bookReviews .elementListBrownSeparator {
  display: none;
}

footer.responsiveSiteFooter {
  position: absolute;
  left: 0;
  right: 0;
}

div[id^=relatedWorks] ~ .stacked .bigBoxContent.containerWithHeaderContent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
  `;

 const style = document.createElement('style');
 style.appendChild(new Text(css));
 document.querySelector('body').appendChild(style);

 const lazyLoadableView = document.querySelector('div#lazy_loadable_view');

 const llvHeight = lazyLoadableView.clientHeight;

 document
  .querySelector('footer.responsiveSiteFooter')
  .style.setProperty('top', `${1260 + llvHeight}px`);
}());

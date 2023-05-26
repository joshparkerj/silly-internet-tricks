export default function getMwPagesH2() {
 let mwPagesH2 = document.querySelector('#mw-pages > h2');
 if (!mwPagesH2) {
  let mwPages = document.querySelector('#mw-pages');
  if (!mwPages) {
   mwPages = document.createElement('div');
   mwPages.id = 'mw-pages';
   document.querySelector('div#mw-content-text').after(mwPages);
  }

  mwPagesH2 = document.createElement('h2');
  mwPages.appendChild(mwPagesH2);
 }

 return mwPagesH2;
}

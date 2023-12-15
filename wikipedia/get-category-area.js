export default function getCategoryArea() {
 let categoryArea = document.querySelector('div#mw-pages > div.mw-content-ltr');
 if (!categoryArea) {
  const mwPages = document.createElement('div');
  mwPages.id = 'mw-pages';
  categoryArea = document.createElement('div');
  categoryArea.classList.add('mw-content-ltr');
  mwPages.appendChild(categoryArea);
  document.querySelector('div#mw-content-text').after(mwPages);
 }

 return categoryArea;
}

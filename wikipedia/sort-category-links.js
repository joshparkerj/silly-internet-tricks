import undoSort from './undo-sort';

export default function sortCategoryLinks(sortButton, sortButtonText) {
 const categoryLinks = document.querySelectorAll('#mw-pages li > a');
 const linkSorter = (ab) => {
  const viewMatch = ab.innerText.match(/\(movement: (-?\d+)\)/);
  if (viewMatch) {
   return +viewMatch[1];
  }

  return -1;
 };

 const sortedLinks = [...categoryLinks].sort((a, b) => linkSorter(b) - linkSorter(a));
 const mwCategory = document.querySelector('#mw-pages .mw-category');
 const mwContentLtr = document.querySelector('#mw-pages .mw-content-ltr');
 const categorySection = mwCategory || mwContentLtr;
 categorySection.innerHTML = '';

 document.styleSheets[0].insertRule('#mw-pages .mw-category a { display: block; }');
 document.styleSheets[0].insertRule('#mw-pages .mw-category ~ .mw-category { display: none; }');
 sortedLinks.forEach((link) => categorySection.appendChild(link));
 sortButton.removeEventListener('click', sortCategoryLinks);
 sortButton.addEventListener('click', () => undoSort(sortButton, () => sortButtonText, sortCategoryLinks));
 sortButton.replaceChildren(new Text('undo sort'));
}

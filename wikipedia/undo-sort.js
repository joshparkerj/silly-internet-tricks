export default function undoSort(sortButton, sortButtonText, sortCategoryLinks) {
  const allCategorySections = document.querySelectorAll('#mw-pages .mw-category');
  const unsorted = [...allCategorySections].map((section) => section.innerHTML);

  document.styleSheets[0].deleteRule(0);
  document.styleSheets[0].deleteRule(0);
  allCategorySections.forEach((section, i) => {
    const s = section;
    s.innerHTML = unsorted[i];
  });

  sortButton.removeEventListener('click', undoSort);
  sortButton.addEventListener('click', sortCategoryLinks);
  sortButton.replaceChildren(new Text(sortButtonText()));
}

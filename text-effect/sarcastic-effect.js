export default function sarcasticEffect(element) {
  const e = element;
  const sarcasticCase = function sarcasticCase(char, i) {
    if (i % 2) {
      return char.toLocaleLowerCase();
    }

    return char.toLocaleUpperCase();
  };

  e.textContent = e.textContent.split('').map(sarcasticCase).join('');
}

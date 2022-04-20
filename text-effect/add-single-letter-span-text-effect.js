export default function addSingleLetterSpanTextEffect(element, effect) {
  const e = element;
  const elementLength = e.textContent.length;
  const singleLetterSpans = e.textContent.split('').map((c, i) => {
    const singleLetterSpan = document.createElement('span');
    singleLetterSpan.textContent = c;
    effect(singleLetterSpan, i, elementLength);
    return singleLetterSpan;
  });

  e.textContent = '';
  singleLetterSpans.forEach((span) => e.appendChild(span));
}

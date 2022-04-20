export default function zanyEffect(singleLetterSpan) {
  singleLetterSpan.style.setProperty('transform', `rotate(${Math.random() / 5 - 0.1}turn)`);
  singleLetterSpan.style.setProperty('display', 'inline-block');
  if (singleLetterSpan.textContent === ' ') {
    singleLetterSpan.style.setProperty('padding', '0 .25em');
  }
}

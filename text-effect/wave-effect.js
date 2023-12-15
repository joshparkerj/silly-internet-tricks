export default function waveEffect(singleLetterSpan, i, length) {
 singleLetterSpan.classList.add('josh-wave');
 singleLetterSpan.style.setProperty('animation-delay', `${(i / length) * 3000}ms`);
 if (singleLetterSpan.textContent === ' ') {
  singleLetterSpan.style.setProperty('padding', '0 .25em');
 }
}

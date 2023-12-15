export default function rainbowEffect(singleLetterSpan, i, elementLength) {
 singleLetterSpan.style.setProperty('color', `hsl(${(270 * i) / elementLength} 100% 50%)`);
}

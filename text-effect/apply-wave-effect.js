import addSingleLetterSpanTextEffect from './add-single-letter-span-text-effect';
import addCSSRule from './add-css-rule';
import waveEffect from './wave-effect';

export default function applyWaveEffect(element) {
 addCSSRule(
  '@keyframes wave {from {transform: translateY(0);} 25% {transform: translateY(-100%);} 50% {transform: translateY(0);} to {transform: translateY(0);}}',
 );
 addCSSRule(
  'span.josh-wave {animation-duration: 3s; animation-name: wave; animation-iteration-count: infinite; display: inline-block;}',
 );
 addSingleLetterSpanTextEffect(element, waveEffect);
}

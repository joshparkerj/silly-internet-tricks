import effectify from './effectify';

export default function standAloneTextEffect(buttonText, effectClassName, applyTextEffect) {
 const existingTextManips = document.querySelector('body > div.josh-text-manips');
 const joshTextManips = existingTextManips || document.createElement('div');
 joshTextManips.className = 'josh-text-manips';

 joshTextManips.appendChild(effectify(buttonText, effectClassName, applyTextEffect));
 if (!existingTextManips) {
  document.querySelector('body').appendChild(joshTextManips);
 }

 document.styleSheets[0].insertRule(
  '.josh-text-manips {position: fixed;background-color: lightgrey;padding: 5px 10px;top: 62px;right: 10px;border-radius: 16px;box-shadow: 2px 2px 1px black;}',
 );
}

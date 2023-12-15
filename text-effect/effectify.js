export default function effectify(buttonText, effectClassName, applyTextEffect) {
 const body = document.querySelector('body');
 const textEffectButton = document.createElement('button');
 textEffectButton.innerText = buttonText;

 const addTextEffect = function addTextEffect({ target }) {
  const e = target;
  body.removeEventListener('mousedown', addTextEffect);

  const singleLetterSpans = e.textContent.split('').map((c) => {
   const singleLetterSpan = document.createElement('span');
   singleLetterSpan.textContent = c;
   return singleLetterSpan;
  });

  e.textContent = '';
  singleLetterSpans.forEach((span) => e.appendChild(span));

  const textEffectMouseover = ({ target: mouseoverTarget }) => {
   if (mouseoverTarget.tagName === 'SPAN') {
    mouseoverTarget.classList.add('selected');
   }
  };

  e.addEventListener('mouseover', textEffectMouseover);

  const textEffectMouseup = () => {
   e.removeEventListener('mouseup', textEffectMouseup);
   e.removeEventListener('mouseover', textEffectMouseover);
   const text = e.textContent;
   const classNames = [...e.childNodes].map((node) => node.className);
   const selectionStart = classNames.indexOf('selected');
   const selectionEnd = classNames.lastIndexOf('selected') + 1;

   e.innerHTML = '';
   e.appendChild(new Text(text.slice(0, selectionStart)));
   const effectSpan = document.createElement('span');
   effectSpan.className = effectClassName;
   effectSpan.appendChild(new Text(text.slice(selectionStart, selectionEnd)));
   e.appendChild(effectSpan);
   e.appendChild(new Text(text.slice(selectionEnd)));

   applyTextEffect(e.querySelector(`span.${effectClassName}`));
   textEffectButton.removeAttribute('disabled');
  };

  e.addEventListener('mouseup', textEffectMouseup);
 };

 textEffectButton.addEventListener('click', () => {
  textEffectButton.setAttribute('disabled', true);
  body.addEventListener('mousedown', addTextEffect);
 });

 return textEffectButton;
}

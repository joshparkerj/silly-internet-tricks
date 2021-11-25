(function rainbowifyUserScript() {
  const buttonText = 'rainbowify';
  const effectClassName = 'rainbow-text';
  const textEffect = function rainbowEffect(singleLetterSpan, i, elementLength) {
    singleLetterSpan.style.setProperty('color', `hsl(${(270 * i) / elementLength} 100% 50%)`);
  };

  const body = document.querySelector('body');
  const existingTextManips = document.querySelector('body > div.josh-text-manips');
  const joshTextManips = existingTextManips || document.createElement('div');
  joshTextManips.className = 'josh-text-manips';
  const textEffectButton = document.createElement('button');
  textEffectButton.innerText = buttonText;

  const addSingleLetterSpanTextEffect = function addSingleLetterSpanTextEffect(element, effect) {
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
  };

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
      const f = mouseoverTarget;
      if (f.tagName === 'SPAN') {
        f.className = 'selected';
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
      e.innerHTML = `${text.slice(0, selectionStart)}<span class='${effectClassName}'>${text.slice(selectionStart, selectionEnd)}</span>${text.slice(selectionEnd)}`;
      addSingleLetterSpanTextEffect(e.querySelector(`span.${effectClassName}`), textEffect);
      textEffectButton.removeAttribute('disabled');
    };

    e.addEventListener('mouseup', textEffectMouseup);
  };

  textEffectButton.addEventListener('click', () => {
    textEffectButton.setAttribute('disabled', true);
    body.addEventListener('mousedown', addTextEffect);
  });

  joshTextManips.appendChild(textEffectButton);
  if (!existingTextManips) {
    body.appendChild(joshTextManips);
  }

  document.styleSheets[0].insertRule('.josh-text-manips {position: fixed;background-color: lightgrey;padding: 5px 10px;top: 62px;right: 10px;border-radius: 16px;box-shadow: 2px 2px 1px black;}');
}());

(function zanyifyUserScript() {
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

  /* This section is unique to the zany effect */
  const buttonText = 'zanyify';
  const effectClassName = 'zany-text';
  const textEffect = function zanyEffect(singleLetterSpan) {
    singleLetterSpan.style.setProperty('transform', `rotate(${Math.random() / 5 - 0.1}turn)`);
    singleLetterSpan.style.setProperty('display', 'inline-block');
    if (singleLetterSpan.textContent === ' ') {
      singleLetterSpan.style.setProperty('padding', '0 .25em');
    }
  };

  const addZanyEffect = function addZanyEffect(element) {
    addSingleLetterSpanTextEffect(element, textEffect);
  };

  /* The rest is common to all of the text effects.
     It's duplicated in each script
     because I want them each to be usable as stand-alone scripts. */
  const body = document.querySelector('body');
  const existingTextManips = document.querySelector('body > div.josh-text-manips');
  const joshTextManips = existingTextManips || document.createElement('div');
  joshTextManips.className = 'josh-text-manips';
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
      addZanyEffect(e.querySelector(`span.${effectClassName}`));
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

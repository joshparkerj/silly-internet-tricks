// ==UserScript==
// @name         Settings on My Creations (no grid) json api
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get the settings from json api. Don't attempt to style as grid
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/my-creations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==

(function settingsOnMyCreations() {
  const percent = (n) => `${Math.round(100 * n)}%`;
  const cap = (w) => `${w[0].toLocaleUpperCase()}${w.slice(1)}`;

  const cardContainerSelector = '#__next div.css-16jqqjd + div > .css-0';
  const cardSelector = `${cardContainerSelector} > div`;
  const css = `
#__next div.css-1918gjp {
  margin: auto;
  max-width: none;
}

.creation-settings {
  position: relative;
  top: -400px;
  left: 400px;
  height: 0;
  max-width: ${window.innerWidth - 1000}px;
}

.creation-settings h4 {
  display: inline;
  margin-right: 0.5rem;
}

h3.css-1txomwt {
  max-width: 350px;
}

#creation-settings-likedby {
  display: none;
}
`;

  const style = document.createElement('style');
  style.appendChild(new Text(css));

  const body = document.querySelector('body');
  body.appendChild(style);
  body.addEventListener('click', ({ target }) => {
    if (target.tagName === 'A') {
      window.location.assign(target.href);
    }
  });

  const { buildId } = JSON.parse(document.querySelector('#__NEXT_DATA__').textContent);

  const modifyMyCreations = () => {
    const cards = document.querySelectorAll(cardSelector);
    cards.forEach(async (card) => {
      const cardA = card.querySelector('a');
      if (!cardA || card.classList.contains('checked-for-creation-settings')) return;

      card.classList.add('checked-for-creation-settings');
      const { href } = cardA;
      if (!href.includes('creator.nightcafe.studio/creation')) return;

      const creationId = href.match(/creator.nightcafe.studio\/creation\/(.*)/)[1];
      const dataHref = window.location.href.replace('my-creations', `_next/data/${buildId}/creation/${creationId}.json?cid=${creationId}`);

      const response = await fetch(dataHref);
      const data = await response.json();

      console.log(JSON.stringify(data));

      const {
        algorithm, /* likedBy, */ promptWeights, prompts, resolution, runtime, seed, preset,
      } = data.pageProps.initialJob;

      const creationSettingsHtml = `
<h2>Creation Settings</h2>
<div id="creation-settings-preset-style">
  <h4>Preset Style</h4>
</div>
<div id="creation-settings-text-prompts">
  <h4>Text Prompts</h4>
</div>
<div id="creation-settings-initial-resolution">
  <h4>Initial Resolution</h4>
</div>
<div id="creation-settings-runtime">
  <h4>Runtime</h4>
</div>
<div id="creation-settings-seed">
  <h4>Seed</h4>
</div>
<div id="creation-settings-overall-prompt-weight">
  <h4>Weight</h4>
</div>
<div id="creation-settings-accuracy-boost">
  <h4>Accuracy Boost</h4>
</div>
<div id="creation-settings-symmetry">
  <h4>Symmetry</h4>
</div>
<div id="creation-settings-likedby">
  <h4>Liked By</h4>
</div>
      `;

      const creationSettings = document.createElement('div');
      creationSettings.classList.add('creation-settings');
      creationSettings.innerHTML = creationSettingsHtml;

      const textPrompts = creationSettings.querySelector('#creation-settings-text-prompts');
      prompts.forEach((prompt, i) => {
        textPrompts.appendChild(new Text(`${prompt} - weight: ${promptWeights[i]}`));
        textPrompts.appendChild(document.createElement('br'));
      });

      const initialResolution = creationSettings.querySelector('#creation-settings-initial-resolution');
      initialResolution.appendChild(new Text(cap(resolution)));

      const runtimeDiv = creationSettings.querySelector('#creation-settings-runtime');
      runtimeDiv.appendChild(new Text(cap(runtime)));

      const seedDiv = creationSettings.querySelector('#creation-settings-seed');
      seedDiv.appendChild(new Text(seed));

      if (algorithm === 'vqganclip') {
        creationSettings.querySelector('#creation-settings-overall-prompt-weight').style.setProperty('display', 'none');
        creationSettings.querySelector('#creation-settings-accuracy-boost').style.setProperty('display', 'none');
        creationSettings.querySelector('#creation-settings-symmetry').style.setProperty('display', 'none');
        if (preset === 'none') {
          creationSettings.querySelector('#creation-settings-preset-style').style.setProperty('display', 'none');
        } else {
          creationSettings.querySelector('#creation-settings-preset-style').appendChild(new Text(preset));
        }
      } else if (algorithm === 'diffusion') {
        const {
          accuracyBoost,
          cutBatchesBoost,
          horizontalSymmetry,
          verticalSymmetry,
          symmetryTransformationPercent,
          promptWeight,
          initScale,
          noiseInfluence,
        } = data.pageProps.initialJob;

        creationSettings.querySelector('#creation-settings-overall-prompt-weight').appendChild(
          new Text(`Overall Prompt Weight: ${percent(promptWeight)}. Start Image Weight: ${percent(initScale)}. Noise Weight: ${percent(noiseInfluence)}.`),
        );

        creationSettings.querySelector('#creation-settings-accuracy-boost').appendChild(new Text((accuracyBoost && cutBatchesBoost && 'Extra') || (accuracyBoost && 'Standard') || 'None'));

        const symmetry = creationSettings.querySelector('#creation-settings-symmetry');
        if (horizontalSymmetry && verticalSymmetry) {
          symmetry.appendChild(new Text(`Horizontal and Vertical ${percent(symmetryTransformationPercent)}`));
        } else if (horizontalSymmetry) {
          symmetry.appendChild(new Text(`Horizontal ${percent(symmetryTransformationPercent)}`));
        } else if (verticalSymmetry) {
          symmetry.appendChild(new Text(`Vertical ${percent(symmetryTransformationPercent)}`));
        } else {
          symmetry.style.setProperty('display', 'none');
        }

        creationSettings.querySelector('#creation-settings-symmetry').style.setProperty('display', 'none');
      } else {
        console.error(`wasn't expecting ${algorithm}!`);
      }

      card.appendChild(creationSettings);
      card.style.setProperty('min-height', `${creationSettings.scrollHeight}px`);
    });
  };

  const mo = new MutationObserver(modifyMyCreations);
  mo.observe(document.querySelector('#__next'), { childList: true, subtree: true });

  modifyMyCreations();
}());

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

  const appendText = (root, text, selector) => {
    if (selector) {
      root.querySelector(selector).appendChild(new Text(text));
    } else {
      root.appendChild(new Text(text));
    }
  };

  const displayNone = (root, selector) => {
    if (selector) {
      root.querySelector(selector).style.setProperty('display', 'none');
    } else {
      root.style.setProperty('display', 'none');
    }
  };

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

[id^="creation-settings-likedby"] {
  display: none;
}
`;

  const style = document.createElement('style');
  appendText(style, css);

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
<div id="creation-settings-preset-style-${creationId}">
  <h4>Preset Style</h4>
</div>
<div id="creation-settings-text-prompts-${creationId}">
  <h4>Text Prompts</h4>
</div>
<div id="creation-settings-initial-resolution-${creationId}">
  <h4>Initial Resolution</h4>
</div>
<div id="creation-settings-runtime-${creationId}">
  <h4>Runtime</h4>
</div>
<div id="creation-settings-seed-${creationId}">
  <h4>Seed</h4>
</div>
<div id="creation-settings-overall-prompt-weight-${creationId}">
  <h4>Weight</h4>
</div>
<div id="creation-settings-accuracy-boost-${creationId}">
  <h4>Accuracy Boost</h4>
</div>
<div id="creation-settings-symmetry-${creationId}">
  <h4>Symmetry</h4>
</div>
<div id="creation-settings-likedby-${creationId}">
  <h4>Liked By</h4>
</div>
`;

      const creationSettings = document.createElement('div');
      creationSettings.classList.add('creation-settings');
      creationSettings.innerHTML = creationSettingsHtml;

      const textPrompts = creationSettings.querySelector('[id^="creation-settings-text-prompts"]');
      prompts.forEach((prompt, i) => {
        appendText(textPrompts, `"${prompt}" - weight: ${promptWeights[i]}`);
        textPrompts.appendChild(document.createElement('br'));
      });

      appendText(creationSettings, cap(resolution), '[id^="creation-settings-initial-resolution"]');

      appendText(creationSettings, cap(runtime), '[id^="creation-settings-runtime"]');

      appendText(creationSettings, seed, '[id^="creation-settings-seed"]');

      if (algorithm === 'vqganclip') {
        displayNone(creationSettings, '[id^="creation-settings-overall-prompt-weight"]');
        displayNone(creationSettings, '[id^="creation-settings-accuracy-boost"]');
        displayNone(creationSettings, '[id^="creation-settings-symmetry"]');

        if (preset === 'none') {
          displayNone(creationSettings, '[id^="creation-settings-preset-style"]');
        } else {
          appendText(creationSettings, preset, '[id^="creation-settings-preset-style"]');
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

        appendText(creationSettings, `Overall Prompt Weight: ${percent(promptWeight)}. Start Image Weight: ${percent(initScale)}. Noise Weight: ${percent(noiseInfluence)}.`, '[id^="creation-settings-overall-prompt-weight"');

        appendText(creationSettings, (accuracyBoost && cutBatchesBoost && 'Extra') || (accuracyBoost && 'Standard') || 'None', '[id^="creation-settings-accuracy-boost"]');

        const symmetry = creationSettings.querySelector('[id^="creation-settings-symmetry"]');
        if (horizontalSymmetry && verticalSymmetry) {
          appendText(symmetry, `Horizontal and Vertical ${percent(symmetryTransformationPercent)}`);
        } else if (horizontalSymmetry) {
          appendText(symmetry, `Horizontal ${percent(symmetryTransformationPercent)}`);
        } else if (verticalSymmetry) {
          appendText(symmetry, `Vertical ${percent(symmetryTransformationPercent)}`);
        } else {
          displayNone(symmetry);
        }

        displayNone(creationSettings, '[id^="creation-settings-preset-style"]');
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

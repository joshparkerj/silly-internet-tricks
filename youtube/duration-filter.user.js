// ==UserScript==
// @name         Youtube Duration Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       Josh Parker
// @match        https://www.youtube.com/c/*/videos*
// @match        https://www.youtube.com/channel/*/videos*
// @match        https://www.youtube.com/user/*/videos*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// ==/UserScript==

(function userScript() {
  const parseDuration = function parseDuration(duration) {
    const durationMatch = duration.match(/(((?<hours>\d+):)?(?<minutes>\d+):)?(?<seconds>\d+)/);
    if (durationMatch) {
      const { hours, minutes, seconds } = durationMatch.groups;
      return +seconds + (minutes || 0) * 60 + (hours || 0) * 3600;
    }

    return null;
  };

  const ygvrDuration = function ygvrDurationMapper(ygvr) {
    const durationElement = ygvr.querySelector('span.ytd-thumbnail-overlay-time-status-renderer');
    if (durationElement) {
      const text = durationElement.innerText;
      return parseDuration(text);
    }

    return null;
  };

  const durationFilterForm = document.createElement('form');
  durationFilterForm.innerHTML = `<h2>duration filter</h2>
  <h3>format hh:mm:ss</h3>
  <label for="duration-filter-min">min</label>
  <input id="duration-filter-min" type="text" pattern="(([0-9]?\\d:)?[0-5]?\\d:)?[0-5]?\\d" />
  <br><label for="duration-filter-max">max</label>
  <input id="duration-filter-max" type="text" pattern="(([0-9]?\\d:)?[0-5]?\\d:)?[0-5]?\\d" />
  <button>filter</button>`;
  durationFilterForm.id = 'duration-filter';
  durationFilterForm.onsubmit = function filterDurations(event) {
    event.preventDefault();
    const min = parseDuration(document.querySelector('input#duration-filter-min').value);
    const max = parseDuration(document.querySelector('input#duration-filter-max').value);
    const ygvrNodeList = document.querySelectorAll('div#items > ytd-grid-video-renderer.ytd-grid-renderer');
    ygvrNodeList.forEach((node) => {
      const duration = ygvrDuration(node);
      if (!duration || (duration > max || duration < min)) {
        node.parentNode.removeChild(node);
      }
    });
  };

  document.querySelector('div#primary-items').appendChild(durationFilterForm);
}());

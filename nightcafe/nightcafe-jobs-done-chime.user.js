// ==UserScript==
// @name         Night Cafe Get Top Creations using artist names.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Josh Parker
// @match        https://creator.nightcafe.studio/explore*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// ==/UserScript==
const chorder = () => {
  const a = new AudioContext();
  return (d, f, v, t) => f.forEach((n) => {
    const o = a.createOscillator();
    const g = a.createGain();
    o.connect(g);
    g.connect(a.destination);
    g.gain.value = v;
    o.frequency.value = n;
    o.type = t;
    o.start(a.currentTime);
    o.stop(a.currentTime + d / 1000);
  });
};

const chord = chorder();

setTimeout(() => chord(500, [262, 392, 494, 659], 0.5, 'square'), 0);
setTimeout(() => chord(500, [294, 440, 523, 698], 0.5, 'square'), 500);
setTimeout(() => chord(500, [349, 523, 659, 880], 0.5, 'square'), 1000);
setTimeout(() => chord(1000, [330, 494, 587, 784], 0.5, 'square'), 1500);
setTimeout(() => chord(1000, [277, 415, 523, 698], 0.5, 'square'), 2500);

chord = () => { a = new AudioContext(); return (d, f, v, t) => f.forEach(n => { o = a.createOscillator(); g = a.createGain(); o.connect(g); g.connect(a.destination); g.gain.value = v; o.frequency.value = n; o.type = t; o.start(a.currentTime); o.stop(a.currentTime + d / 1000) }) }
chord = chord()
setTimeout(() => chord(500, [262,392,494,659], 0.5, 'square'), 0); setTimeout(() => chord(500, [294,440,523,698], 0.5, 'square'), 500); setTimeout(() => chord(500, [349,523,659,880], 0.5, 'square'), 1000); setTimeout(() => chord(1000, [330,494,587,784], 0.5, 'square'), 1500); setTimeout(() => chord(1000, [277,415,523,698], 0.5, 'square'), 2500);


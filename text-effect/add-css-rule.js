export default function addCSSRule(rule) {
  const style = document.createElement('style');
  style.textContent = rule;
  document.querySelector('head').appendChild(style);
}

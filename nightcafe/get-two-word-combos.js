export default function getTwoWordCombos(s) {
  const re = /\w+\W+\w+/g;

  return s.match(re)?.concat(s.replace(/\w+/, '').match(re));
}

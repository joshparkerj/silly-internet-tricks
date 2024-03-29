const zalgoChars = [
 '̍',
 '̎',
 '̄',
 '̅',
 '̿',
 '̑',
 '̆',
 '̐',
 '͒',
 '͗',
 '͑',
 '̇',
 '̈',
 '̊',
 '͂',
 '̓',
 '̈́',
 '͊',
 '͋',
 '͌',
 '̃',
 '̂',
 '̌',
 '̀',
 '́',
 '̋',
 '̏',
 '̒',
 '̓',
 '̔',
 '̽',
 '̉',
 '̾',
 '͆',
 '̚',
 '̖',
 '̗',
 '̘',
 '̙',
 '̜',
 '̝',
 '̞',
 '̟',
 '̠',
 '̤',
 '̥',
 '̦',
 '̩',
 '̪',
 '̫',
 '̬',
 '̭',
 '̮',
 '̯',
 '̰',
 '̱',
 '̲',
 '̳',
 '̹',
 '̺',
 '̻',
 '̼',
 'ͅ',
 '͇',
 '͈',
 '͉',
 '͍',
 '͎',
 '͓',
 '͚',
 '̣',
 '̕',
 '̛',
 '̀',
 '́',
 '͘',
 '̡',
 '̢',
 '̧',
 '̨',
 '̴',
 '̵',
 '̶',
 '͏',
 '͜',
 '͝',
 '͞',
 '͟',
 '͠',
 '͢',
 '̸',
 '̷',
 '͡',
 '҉',
];
const randZalg = () => zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
const randZalgs = () => [0, 1, 2, 3, 4].map(() => randZalg());

export default function zalgoEffect(element) {
 const e = element;
 e.textContent = e.textContent
  .split('')
  .map((c) => c + randZalgs().join(''))
  .join('');
}

const today = new Date();
const hourNow = today.getHours();
const greeting = (hourNow > 18 && 'Good evening!')
  || (hourNow > 12 && 'Good afternoon!')
  || (hourNow > 0 && 'Good morning!')
  || 'Welcome!';

document.write(`<h3>${greeting}</h3>`);

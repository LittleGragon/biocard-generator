const idx = Math.floor((new Date().getHours()));
const body = document.getElementsByTagName('body')[0];
body.className = `heaven-${idx}`;

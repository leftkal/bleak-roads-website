const header = document.querySelector('[data-header]');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.reveal, .intro-body, .feature-copy, .encounter-heading, .encounter-stage, .manifesto blockquote, .dispatch-content');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => observer.observe(item));

const diceFaces = {
  knife: [
    { image: 'assets/dice/melee.webp', label: 'STRIKE', alt: 'Melee strike result' },
    { image: 'assets/dice/melee+expose.webp', label: 'EXPOSE', alt: 'Melee and expose result' },
    { image: 'assets/dice/blank.webp', label: 'BLANK', alt: 'Blank result' },
  ],
  pistol: [
    { image: 'assets/dice/global.webp', label: 'SHOT', alt: 'Ranged shot result' },
    { image: 'assets/dice/reload.webp', label: 'RELOAD', alt: 'Reload result' },
    { image: 'assets/dice/blank.webp', label: 'BLANK', alt: 'Blank result' },
  ],
  block: [
    { image: 'assets/dice/armor.webp', label: 'GUARD', alt: 'Armor result' },
    { image: 'assets/dice/blank.webp', label: 'BLANK', alt: 'Blank result' },
  ],
};

const dice = [...document.querySelectorAll('[data-die]')];
const rollButton = document.querySelector('[data-roll-dice]');
const rollStatus = document.querySelector('[data-roll-status]');
let isRolling = false;

function setDieFace(die, face) {
  const image = die.querySelector('img');
  image.src = face.image;
  image.alt = face.alt;
  die.closest('.die-wrap').querySelector('[data-die-label]').textContent = face.label;
}

function rollHand() {
  if (isRolling) return;
  isRolling = true;
  rollButton.disabled = true;
  rollStatus.textContent = 'Rolling the hand…';
  const timers = dice.map((die, dieIndex) => setInterval(() => {
    const faces = diceFaces[die.dataset.die];
    setDieFace(die, faces[Math.floor(Math.random() * faces.length)]);
  }, 65 + dieIndex * 12));
  dice.forEach((die) => die.classList.add('is-rolling'));
  window.setTimeout(() => {
    const outcome = [];
    dice.forEach((die, index) => {
      clearInterval(timers[index]);
      const faces = diceFaces[die.dataset.die];
      const face = faces[Math.floor(Math.random() * faces.length)];
      setDieFace(die, face);
      die.classList.remove('is-rolling');
      die.classList.add('is-landed');
      window.setTimeout(() => die.classList.remove('is-landed'), 400);
      outcome.push(face.label.toLowerCase());
    });
    rollStatus.textContent = `Hand resolved: ${outcome.join(' • ')}.`;
    rollButton.disabled = false;
    isRolling = false;
  }, 920);
}

rollButton?.addEventListener('click', rollHand);
dice.forEach((die) => die.addEventListener('click', rollHand));

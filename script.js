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
  rollStatus.textContent = 'The dice are in motion…';
  const outcomes = new Array(dice.length);
  let resolvedDice = 0;

  dice.forEach((die, index) => {
    const faces = diceFaces[die.dataset.die];
    const startDelay = Math.floor(Math.random() * 210);
    const rollDuration = 620 + Math.floor(Math.random() * 620);
    const cadence = 50 + Math.floor(Math.random() * 75);
    const finalFace = faces[Math.floor(Math.random() * faces.length)];

    window.setTimeout(() => {
      die.classList.add('is-rolling');
      const faceTimer = window.setInterval(() => {
        setDieFace(die, faces[Math.floor(Math.random() * faces.length)]);
      }, cadence);

      window.setTimeout(() => {
        window.clearInterval(faceTimer);
        setDieFace(die, finalFace);
        die.classList.remove('is-rolling');
        die.classList.add('is-landed');
        window.setTimeout(() => die.classList.remove('is-landed'), 400);
        outcomes[index] = finalFace.label.toLowerCase();
        resolvedDice += 1;
        if (resolvedDice === dice.length) {
          rollStatus.textContent = `Hand resolved: ${outcomes.join(' • ')}.`;
          rollButton.disabled = false;
          isRolling = false;
        }
      }, rollDuration);
    }, startDelay);
  });
}

rollButton?.addEventListener('click', rollHand);
dice.forEach((die) => die.addEventListener('click', rollHand));

/*************************************************
 * GLOBAL HELPERS
 *************************************************/
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/*************************************************
 * TYPING EFFECT
 *************************************************/
const text =
  '🎆 HAPPY NEW YEAR 2026 🎆\n' +
  'Chúc em một năm mới rực rỡ ✨\n' +
  'Bình an – Thành công – Hạnh phúc ❤️';

let typingIndex = 0;
const typingElement = document.getElementById('typing');

function typeText() {
  if (typingIndex < text.length) {
    typingElement.innerHTML +=
      text[typingIndex] === '\n' ? '<br>' : text[typingIndex];
    typingIndex++;
    setTimeout(typeText, 80);
  }
}
typeText();

/*************************************************
 * REASONS
 *************************************************/
const reasons = [
  'Chúc em luôn mạnh khỏe và bình an trong năm mới 🌸',
  'Chúc mọi ước mơ của em sớm trở thành hiện thực ✨',
  'Mong nụ cười của em luôn rạng rỡ mỗi ngày 😊',
  'Chúc em thành công trên con đường em chọn 💖',
  'Một món quà nhỏ anh dành cho em trong năm mới 🎁',
];

const reasonList = document.getElementById('reasonList');

reasons.forEach((t, i) => {
  const li = document.createElement('li');
  li.innerText = t;
  reasonList.appendChild(li);
  setTimeout(() => (li.style.opacity = 1), (i + 1) * 2000);
});

/*************************************************
 * MUSIC + BEAT SYNC (LIGHT)
 *************************************************/
const music = document.getElementById('music');
const musicToggle = document.getElementById('musicToggle');

/* ===== PLAYLIST ===== */
const playlist = [
  'music/canhthiepdauxuan.mp3',
  'music/muaxuandautien.mp3',
  'music/namquatoidalamgi.mp3',
];

let currentTrack = 0;
let isPlaying = false;

music.volume = 0.8;
music.muted = false;
music.src = playlist[currentTrack];

/* khi hết bài → tự sang bài tiếp */
music.addEventListener('ended', () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  music.src = playlist[currentTrack];
  music.play().catch(() => {});
});

/* toggle 🔇 / 🔊 */
musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!isPlaying) {
    music.play().catch(() => {});
    musicToggle.textContent = '🔊';
    isPlaying = true;
  } else {
    music.pause();
    musicToggle.textContent = '🔇';
    isPlaying = false;
  }
});

/*************************************************
 * BEAT DETECT (LIGHT) – GIỮ SLIDER CHẠY
 *************************************************/
let lastBeat = 0;
const BEAT_INTERVAL = 0.95;

function onBeat(cb) {
  if (!music || music.paused) return;
  if (music.currentTime - lastBeat > BEAT_INTERVAL) {
    lastBeat = music.currentTime;
    cb();
  }
}

/*************************************************
 * GIFT BUTTON
 *************************************************/
const giftBtn = document.getElementById('giftBtn');
const finalMessage = document.getElementById('finalMessage');
const gallery = document.getElementById('gallery');

giftBtn.addEventListener('click', () => {
  music.currentTime = 0;
  music.play().catch(() => {});
  musicToggle.textContent = '🔊';

  startFallingImages();

  giftReveal.classList.remove('hidden');
  gallery.classList.remove('hidden');
  finalMessage.classList.remove('hidden');
  angelLeft.classList.remove('hidden');
  angelRight.classList.remove('hidden');

  giftBtn.style.display = 'none';

  setTimeout(() => {
    gallery.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 400);

  startFireworkLoop();
});

/*************************************************
 * SNOW EFFECT
 *************************************************/
const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// const snowflakes = Array.from({ length: 150 }, () => ({
//   x: Math.random() * canvas.width,
//   y: Math.random() * canvas.height,
//   r: Math.random() * 4 + 1,
//   d: Math.random(),
// }));

// let snowAngle = 0;

// setInterval(() => {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = 'white';
//   ctx.beginPath();

//   snowflakes.forEach((f) => {
//     ctx.moveTo(f.x, f.y);
//     ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
//     f.y += Math.cos(snowAngle + f.d) + 1;
//     f.x += Math.sin(snowAngle) * 0.5;

//     if (f.y > canvas.height) {
//       f.y = 0;
//       f.x = Math.random() * canvas.width;
//     }
//   });

//   ctx.fill();
//   snowAngle += 0.01;
// }, 25);

/*************************************************
 * FALLING IMAGES
 *************************************************/
const fallImages = [
  { src: 'music/image22.png', class: 'tree' },
  { src: 'music/image25.png', class: 'angel' },
  { src: 'music/image26.png', class: 'santa' },
];

let fallingInterval = null;

function createFallingItem() {
  const item = random(fallImages);
  const img = document.createElement('img');
  img.src = item.src;
  img.className = `fall-item ${item.class}`;
  img.style.left = Math.random() * innerWidth + 'px';
  img.style.animationDuration = Math.random() * 6 + 8 + 's';
  document.body.appendChild(img);
  setTimeout(() => img.remove(), 15000);
}

function startFallingImages() {
  if (!fallingInterval) fallingInterval = setInterval(createFallingItem, 700);
}

/*************************************************
 * FIREWORK
 *************************************************/
function createFirework(x, y) {
  const firework = document.createElement('div');
  firework.className = 'firework';
  firework.style.left = x + 'px';
  firework.style.top = y + 'px';

  for (let i = 0; i < 28; i++) {
    const spark = document.createElement('span');
    spark.className = 'spark';
    const angle = (Math.PI * 2 * i) / 28;
    const dist = Math.random() * 140 + 60;
    spark.style.setProperty('--x', Math.cos(angle) * dist + 'px');
    spark.style.setProperty('--y', Math.sin(angle) * dist + 'px');
    spark.style.color = random(['#ffd700', '#ff4d6d', '#7df9ff', '#ffffff']);
    firework.appendChild(spark);
  }

  document.body.appendChild(firework);
  setTimeout(() => firework.remove(), 1800);
}

let fireworkInterval = null;
function startFireworkLoop() {
  if (!fireworkInterval) {
    fireworkInterval = setInterval(() => {
      createFirework(
        innerWidth * (0.2 + Math.random() * 0.6),
        innerHeight * (0.2 + Math.random() * 0.4)
      );
    }, 900);
  }
}

/*************************************************
 * ADVANCED SLIDER – INTRO / SINGLE / OUTRO LOOP
 *************************************************/
const slides = document.querySelectorAll('.slider img');
let slideIndex = 0;
let singleCount = 0;

const MODE = { INTRO: 0, SINGLE: 1, OUTRO: 2 };
let mode = MODE.INTRO;

const entryAnimations = [
  'in-left',
  'in-right',
  'in-top',
  'in-bottom',
  'in-rotate',
  'in-zoom-corner',
];

function getOrientation(img) {
  return img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait';
}

function getEntryByOrientation(img) {
  return getOrientation(img) === 'landscape'
    ? random(['in-left', 'in-right'])
    : random(['in-top', 'in-bottom']);
}

function clearSlides() {
  slides.forEach((img) => {
    img.className = '';
    img.style.removeProperty('--dx');
    img.style.removeProperty('--dy');
    img.style.removeProperty('--rot');
  });
}

/* ---------- INTRO (multi burst) ---------- */
function playIntro() {
  const picks = [...slides].sort(() => Math.random() - 0.5).slice(0, 4);

  picks.forEach((img, i) => {
    img.className = 'burst intro active';
    img.style.setProperty('--dx', `${Math.random() * 300 - 150}px`);
    img.style.setProperty('--dy', `${Math.random() * 200 - 100}px`);
    img.style.setProperty('--rot', `${Math.random() * 20 - 10}deg`);

    onBeat(() => img.classList.add('pulse'));
    setTimeout(() => img.classList.remove('pulse'), 200);
  });

  setTimeout(() => {
    clearSlides();
    mode = MODE.SINGLE;
    playSingle();
  }, 2200);
}

/* ---------- SINGLE (cinematic flow) ---------- */
function playSingle() {
  const prev = slides[(slideIndex - 1 + slides.length) % slides.length];
  if (prev) {
    prev.classList.remove('active');
    prev.classList.add('ghost');
    setTimeout(() => prev.classList.add('fade-out'), 50);
    setTimeout(() => (prev.className = ''), 1700);
  }

  const img = slides[slideIndex];
  const anim = getEntryByOrientation(img);

  img.classList.add('active', anim);
  onBeat(() => (img.style.transform += ' scale(1.04)'));

  slideIndex = (slideIndex + 1) % slides.length;
  singleCount++;

  if (singleCount >= 6) {
    singleCount = 0;
    mode = MODE.OUTRO;
    setTimeout(playOutro, 4500);
  } else {
    setTimeout(playSingle, 4500);
  }
}

/* ---------- OUTRO (burst + light dissolve) ---------- */
function playOutro() {
  const picks = [...slides].sort(() => Math.random() - 0.5).slice(0, 5);

  picks.forEach((img) => {
    img.className = 'burst outro active light-out';
    img.style.setProperty('--dx', `${Math.random() * 400 - 200}px`);
    img.style.setProperty('--dy', `${Math.random() * 300 - 150}px`);
    img.style.setProperty('--rot', `${Math.random() * 30 - 15}deg`);
  });

  setTimeout(() => {
    clearSlides();
    mode = MODE.INTRO;
    playIntro();
  }, 2400);
}

/*************************************************
 * START SLIDER
 *************************************************/
playIntro();

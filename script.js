/************* Typing Effect *************/
const text = 'Merry Christmas 🎄\nTo the most beautiful girl in my life ❤️';
let index = 0;
const typingElement = document.getElementById('typing');

function typeText() {
  if (index < text.length) {
    typingElement.innerHTML += text[index] === '\n' ? '<br>' : text[index];
    index++;
    setTimeout(typeText, 80);
  }
}
typeText();

/************* Reasons *************/
const reasons = [
  'Anh luôn muốn được gặp và bên cạnh cô Trinh mỗi ngày 🌞',
  'Vì em luôn quan tâm anh 🫶',
  'Mỗi lần em cười làm mọi thứ trong anh trở nên rất hạnh phúc ✨😊',
  'Em là điều tuyệt vời nhất trong cuộc đời anh 💖🌷',
  'Hãy mở hộp quà để biết điều bất ngờ anh làm cho em nhé 🎁💌',
];

const reasonList = document.getElementById('reasonList');

reasons.forEach((reason, i) => {
  const li = document.createElement('li');
  li.innerText = reason;
  reasonList.appendChild(li);

  setTimeout(() => {
    li.style.opacity = 1;
  }, (i + 1) * 2000);
});

/************* Music *************/
const music = document.getElementById('music');
const musicToggle = document.getElementById('musicToggle');

if (music) {
  music.loop = true;
  music.volume = 0.8;
}

/* icon bật / tắt nhạc */
musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();

  if (music.muted) {
    music.muted = false;
    music.play();
    musicToggle.textContent = '🔊';
  } else {
    music.muted = true;
    musicToggle.textContent = '🔇';
  }
});

/************* Gift Button *************/
const giftBtn = document.getElementById('giftBtn');
const finalMessage = document.getElementById('finalMessage');
const gallery = document.getElementById('gallery');

giftBtn.addEventListener('click', () => {
  if (music) {
    music.pause(); // đảm bảo dừng
    music.currentTime = 0; // 🔥 QUAY VỀ GIÂY 0
    music.play().catch(() => {});
    musicToggle.textContent = '🔊';
  }

  // bật hiệu ứng rơi
  startFallingImages();

  // HIỆN ẢNH + PHÁO BÔNG
  giftReveal.classList.remove('hidden');
  giftReveal.classList.add('active');

  // show gallery
  gallery.classList.remove('hidden');

  // show lời chúc cuối
  finalMessage.classList.remove('hidden');

  // ✨ HIỆN THIÊN THẦN 2 BÊN
  angelLeft.classList.remove('hidden');
  angelRight.classList.remove('hidden');

  // ẩn nút mở quà
  giftBtn.style.display = 'none';

  // ⏬ SCROLL GALLERY VÀO GIỮA MÀN HÌNH
  setTimeout(() => {
    gallery.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, 300); // đợi gallery hiện ra

  // 🎆 REAL FIREWORK BURST
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      createFirework(
        window.innerWidth * (0.2 + Math.random() * 0.6),
        window.innerHeight * (0.2 + Math.random() * 0.4)
      );
    }, i * 450);
  }

  startFireworkLoop();
});

/************* Snow Effect *************/
const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const snowflakes = [];

for (let i = 0; i < 150; i++) {
  snowflakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 4 + 1,
    d: Math.random() * 1,
  });
}

function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.beginPath();
  snowflakes.forEach((flake) => {
    ctx.moveTo(flake.x, flake.y);
    ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
  });
  ctx.fill();
  moveSnow();
}

let angle = 0;
function moveSnow() {
  angle += 0.01;
  snowflakes.forEach((flake) => {
    flake.y += Math.cos(angle + flake.d) + 1;
    flake.x += Math.sin(angle) * 0.5;

    if (flake.y > canvas.height) {
      flake.y = 0;
      flake.x = Math.random() * canvas.width;
    }
  });
}

setInterval(drawSnow, 25);

/************* Image Slider *************/
const slides = document.querySelectorAll('.slider img');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((img) => img.classList.remove('active'));
  slides[index].classList.add('active');
}

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 3500);

/************* Falling Images *************/
const fallImages = [
  { src: 'music/image7.png', class: 'tree' },
  { src: 'music/image8.png', class: 'angel' },
  { src: 'music/image9.png', class: 'santa' },
  { src: 'music/image19.png', class: 'tree' },
];

function createFallingItem() {
  const item = fallImages[Math.floor(Math.random() * fallImages.length)];

  const img = document.createElement('img');
  img.src = item.src;
  img.className = `fall-item ${item.class}`;

  img.style.left = Math.random() * window.innerWidth + 'px';

  const duration = Math.random() * 6 + 8; // 8–14s
  img.style.animationDuration = duration + 's';

  document.body.appendChild(img);

  setTimeout(() => {
    img.remove();
  }, duration * 1000);
}

/************* Falling Images Control *************/
let fallingInterval = null;

function startFallingImages() {
  if (fallingInterval) return; // tránh chạy 2 lần

  fallingInterval = setInterval(createFallingItem, 700);
}

// document.addEventListener(
//   'click',
//   () => {
//     if (!music) return;

//     music.muted = false;

//     // ⚠️ play() PHẢI nằm trong user click thật
//     music.play().catch(() => {});

//     musicToggle.textContent = '🔊';
//   },
//   { once: true }
// );

/************* SHOOTING STAR *************/
function createMeteor() {
  const meteor = document.createElement('div');
  meteor.className = 'meteor';

  meteor.style.top = Math.random() * window.innerHeight * 0.2 + 'px';

  meteor.style.left = window.innerWidth + Math.random() * 400 + 'px';

  const duration = Math.random() * 2.5 + 3.5; // 3.5 – 6s
  meteor.style.animationDuration = duration + 's';

  document.body.appendChild(meteor);

  setTimeout(() => meteor.remove(), duration * 1000);
}

// mưa sao băng liên tục
setInterval(() => {
  createMeteor();

  if (Math.random() > 0.7) {
    setTimeout(createMeteor, 300);
  }
}, 1200);
/************* REAL FIREWORK (FIXED) *************/
function createFirework(x, y) {
  const firework = document.createElement('div');
  firework.className = 'firework';
  firework.style.left = x + 'px';
  firework.style.top = y + 'px';

  const colors = ['#ffd700', '#ff4d6d', '#7df9ff', '#ffffff', '#ff9f1c'];
  const sparks = 28;

  for (let i = 0; i < sparks; i++) {
    const spark = document.createElement('span');
    spark.className = 'spark';

    const angle = (Math.PI * 2 * i) / sparks;
    const distance = Math.random() * 140 + 60;

    spark.style.setProperty('--x', Math.cos(angle) * distance + 'px');
    spark.style.setProperty('--y', Math.sin(angle) * distance + 'px');
    spark.style.color = colors[Math.floor(Math.random() * colors.length)];

    firework.appendChild(spark);
  }

  document.body.appendChild(firework);

  setTimeout(() => firework.remove(), 1800);
}

/************* FIREWORK LOOP *************/
let fireworkInterval = null;

function startFireworkLoop() {
  if (fireworkInterval) return; // tránh chạy nhiều lần

  fireworkInterval = setInterval(() => {
    createFirework(
      window.innerWidth * (0.15 + Math.random() * 0.7),
      window.innerHeight * (0.15 + Math.random() * 0.5)
    );
  }, 900); // 🔥 1 pháo hoa mỗi 0.9s
}

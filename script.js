/*************************************************
 * HELPERS
 *************************************************/
const $ = (id) => document.getElementById(id);
const rand = (a, b) => Math.random() * (b - a) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const SVGNS = "http://www.w3.org/2000/svg";

/*************************************************
 * STARS (nền trời đêm)
 *************************************************/
(function makeStars() {
  const box = $("stars");
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("i");
    s.style.left = rand(0, 100) + "%";
    s.style.top = rand(0, 70) + "%";
    s.style.animationDelay = rand(0, 3) + "s";
    s.style.animationDuration = rand(2, 5) + "s";
    box.appendChild(s);
  }
})();

/*************************************************
 * SNOW (3 lớp, có gió nhẹ)
 *************************************************/
(function snow() {
  const cv = $("snow");
  const ctx = cv.getContext("2d");
  let w = innerWidth,
    h = innerHeight;
  const flakes = Array.from({ length: 140 }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(1, 4),
    d: rand(0, Math.PI * 2),
  }));
  const resize = () => {
    const kx = innerWidth / w,
      ky = innerHeight / h;
    flakes.forEach((f) => {
      f.x *= kx;
      f.y *= ky;
    });
    w = cv.width = innerWidth;
    h = cv.height = innerHeight;
  };
  cv.width = w;
  cv.height = h;
  addEventListener("resize", resize);

  let t = 0;
  (function loop() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,.85)";
    t += 0.01;
    flakes.forEach((f) => {
      ctx.globalAlpha = 0.35 + f.r / 6;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      f.y += f.r * 0.3 + 0.6;
      f.x += Math.sin(t + f.d) * 0.6 + 0.2;
      if (f.y > h + 5) {
        f.y = -5;
        f.x = rand(0, w);
      }
      if (f.x > w + 5) f.x = -5;
    });
    requestAnimationFrame(loop);
  })();
})();

/*************************************************
 * CÂY THÔNG: đèn nhấp nháy + bóng + chạm để rắc sao
 *************************************************/
(function tree() {
  const tiers = [
    [
      [150, 44],
      [96, 150],
      [204, 150],
    ],
    [
      [150, 104],
      [70, 236],
      [230, 236],
    ],
    [
      [150, 184],
      [52, 332],
      [248, 332],
    ],
  ];
  const colors = ["#ffe066", "#ff4d6d", "#6ee7ff", "#ff9ff3", "#ffffff"];

  const inTri = ([a, b, c]) => {
    let u = Math.random(),
      v = Math.random();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const k = 0.82; // thu vào trong một chút
    const x = a[0] + u * (b[0] - a[0]) + v * (c[0] - a[0]);
    const y = a[1] + u * (b[1] - a[1]) + v * (c[1] - a[1]);
    const cx = (a[0] + b[0] + c[0]) / 3,
      cy = (a[1] + b[1] + c[1]) / 3;
    return [cx + (x - cx) * k, cy + (y - cy) * k];
  };

  tiers.forEach((t, i) => {
    const tierG = $("tier" + i);
    const n = 14 + i * 8;
    for (let j = 0; j < n; j++) {
      const [x, y] = inTri(t);
      const c = document.createElementNS(SVGNS, "circle");
      c.setAttribute("cx", x);
      c.setAttribute("cy", y);
      c.setAttribute("r", rand(2.2, 3.6));
      c.setAttribute("fill", pick(colors));
      c.setAttribute("class", "bulb");
      // đèn chạy: sáng lần lượt từ trên xuống, lệch theo vị trí
      c.style.animationDelay = (y / 340) * 1.6 + (x / 300) * 0.4 + "s";
      c.style.animationDuration = "1.6s";
      tierG.appendChild(c);
    }
    // bóng treo lớn
    for (let j = 0; j < 3 + i; j++) {
      const [x, y] = inTri(t);
      const g = document.createElementNS(SVGNS, "g");
      g.setAttribute("class", "ball");
      g.style.animationDelay = rand(0, 2) + "s";
      const ball = document.createElementNS(SVGNS, "circle");
      ball.setAttribute("cx", x);
      ball.setAttribute("cy", y);
      ball.setAttribute("r", 7);
      ball.setAttribute(
        "fill",
        pick(["#e8445a", "#ffcf4a", "#4aa8ff", "#c77dff"]),
      );
      ball.setAttribute("stroke", "rgba(255,255,255,.7)");
      ball.setAttribute("stroke-width", 1);
      const hl = document.createElementNS(SVGNS, "circle");
      hl.setAttribute("cx", x - 2.5);
      hl.setAttribute("cy", y - 2.5);
      hl.setAttribute("r", 2);
      hl.setAttribute("fill", "rgba(255,255,255,.75)");
      g.append(ball, hl);
      tierG.appendChild(g);
    }
  });

  // chạm cây => cả cây nhún nhảy + pháo sáng + lời nhắn nhỏ
  const msgs = [
    "Anh yêu em ❤️",
    "Merry Xmas 🎄",
    "Em là món quà đẹp nhất 🎁",
    "Mãi bên nhau nhé 💕",
    "Ho ho ho 🎅",
  ];
  const treeEl = $("tree");
  treeEl.addEventListener("click", (e) => {
    treeEl.classList.remove("jump");
    void treeEl.getBoundingClientRect();
    treeEl.classList.add("jump");
    sparkle(e.clientX, e.clientY, 18);
    floatText(e.clientX, e.clientY, pick(msgs));
  });

  // sao nhỏ lấp lánh bay xuống từ đỉnh cây
  setInterval(() => {
    if (document.hidden) return;
    const r = $("star").getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const s = document.createElement("div");
    s.className = "tree-drop";
    s.textContent = pick(["✦", "✧", "✨", "❄"]);
    s.style.left = r.left + r.width / 2 + rand(-60, 60) + "px";
    s.style.top = r.top + r.height / 2 + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3200);
  }, 450);
})();

/*************************************************
 * HIỆU ỨNG: sparkle / float text / firework
 *************************************************/
const SPARK_COLORS = ["#ffd700", "#ff4d6d", "#7df9ff", "#ffffff", "#ff9ff3"];

function sparkle(x, y, n = 24, spread = 120) {
  const fw = document.createElement("div");
  fw.className = "firework";
  fw.style.left = x + "px";
  fw.style.top = y + "px";
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "spark";
    const a = (Math.PI * 2 * i) / n;
    const d = rand(spread * 0.4, spread);
    s.style.setProperty("--x", Math.cos(a) * d + "px");
    s.style.setProperty("--y", Math.sin(a) * d + "px");
    s.style.color = pick(SPARK_COLORS);
    fw.appendChild(s);
  }
  document.body.appendChild(fw);
  setTimeout(() => fw.remove(), 1500);
}

function floatText(x, y, text) {
  const el = document.createElement("div");
  el.className = "float-text";
  el.textContent = text;
  el.style.left = x + "px";
  el.style.top = y + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

/*************************************************
 * NHẠC
 *************************************************/
const music = $("music");
const musicToggle = $("musicToggle");
const playlist = [
  "music/RockinAroundTheChristmasTree.mp3",
  "music/FelizNavidad.mp3",
  "music/muaxuandautien.mp3",
  "music/namquatoidalamgi.mp3",
];
let track = 0;
let playing = false;
music.volume = 0.7;
music.src = playlist[0];

music.addEventListener("ended", () => {
  track = (track + 1) % playlist.length;
  music.src = playlist[track];
  music.play().catch(() => {});
});

function setPlaying(on) {
  playing = on;
  musicToggle.textContent = on ? "🔊" : "🔇";
  if (on) music.play().catch(() => (musicToggle.textContent = "🔇"));
  else music.pause();
}
musicToggle.addEventListener("click", () => setPlaying(!playing));

/*************************************************
 * INTRO: mở thiệp
 *************************************************/
document.body.classList.add("locked");
$("openCard").addEventListener("click", () => {
  $("intro").classList.add("gone");
  document.body.classList.remove("locked");
  setPlaying(true);
  typeText();
  startReasons();
  const cx = innerWidth / 2;
  [0, 300, 650].forEach((d) =>
    setTimeout(
      () =>
        sparkle(cx + rand(-120, 120), innerHeight * rand(0.25, 0.5), 28, 150),
      d,
    ),
  );
});

/*************************************************
 * TYPING
 *************************************************/
const typingText =
  "Giáng Sinh này, anh không cần gì cả\n" +
  "chỉ cần có em ở bên cạnh là đủ ấm rồi 💖";
let typed = false;
function typeText() {
  if (typed) return;
  typed = true;
  const el = $("typing");
  let i = 0;
  (function step() {
    if (i < typingText.length) {
      const ch = typingText[i++];
      el.innerHTML += ch === "\n" ? "<br>" : ch;
      setTimeout(step, 70);
    }
  })();
}

/*************************************************
 * COUNTDOWN TỚI NOEL
 *************************************************/
(function countdown() {
  const label = $("cdLabel");
  function tick() {
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, 11, 25, 0, 0, 0);
    const endDay = new Date(year, 11, 26, 0, 0, 0);
    if (now >= target && now < endDay) {
      ["cdD", "cdH", "cdM", "cdS"].forEach((id) => ($(id).textContent = 0));
      label.textContent = "🎄 Hôm nay là Giáng Sinh rồi! Merry Christmas! 🎅";
      return;
    }
    if (now >= endDay) target = new Date(year + 1, 11, 25, 0, 0, 0);
    const diff = target - now;
    $("cdD").textContent = Math.floor(diff / 864e5);
    $("cdH").textContent = Math.floor((diff / 36e5) % 24);
    $("cdM").textContent = Math.floor((diff / 6e4) % 60);
    $("cdS").textContent = Math.floor((diff / 1e3) % 60);
  }
  tick();
  setInterval(tick, 1000);
})();

/*************************************************
 * LỜI CHÚC (hiện khi cuộn tới)
 *************************************************/
const reasons = [
  "Cảm ơn em vì đã luôn ở bên anh 🌟",
  "Nụ cười của em là ánh đèn đẹp nhất trên cây thông của anh ✨",
  "Chúc em luôn mạnh khỏe, bình an và thật nhiều niềm vui 🌸",
  "Mong mọi ước mơ của em đều thành hiện thực 🎁",
  "Và anh hứa sẽ luôn ở bên em, mùa đông nào cũng vậy ❤️",
];
let reasonsStarted = false;
function startReasons() {
  if (reasonsStarted) return;
  reasonsStarted = true;
  const ul = $("reasonList");
  reasons.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });
  const items = [...ul.children];
  const io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        items.forEach((li, i) =>
          setTimeout(() => li.classList.add("show"), i * 700),
        );
        io.disconnect();
      }
    },
    { threshold: 0.25 },
  );
  io.observe(ul);
}
// phòng khi chưa mở thiệp mà đã tạo (không xảy ra, intro chặn scroll) – vẫn an toàn

/*************************************************
 * REVEAL KHI CUỘN
 *************************************************/
(function reveal() {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

/*************************************************
 * SLIDER ẢNH
 *************************************************/
(function slider() {
  const imgs = [...document.querySelectorAll("#slider img")];
  const captions = [
    "Merry Christmas 🎄",
    "Cô Trinh anh xinh nhất mùa đông ❄️",
    "Nụ cười này dễ thương 😊",
    "Cô Trinh của anh 💖",
    "Yê em nhiều 💖",
    "Mãi bên nhau ngen cô Trinh anh ^^ 💕",
  ];
  let i = 0;
  let timer;
  function go(n) {
    imgs[i].classList.remove("active");
    i = (n + imgs.length) % imgs.length;
    imgs[i].classList.add("active");
    $("caption").textContent = captions[i % captions.length];
  }
  function auto() {
    clearInterval(timer);
    timer = setInterval(() => go(i + 1), 4500);
  }
  $("nextSlide").addEventListener("click", () => {
    go(i + 1);
    auto();
  });
  $("prevSlide").addEventListener("click", () => {
    go(i - 1);
    auto();
  });
  auto();
})();

/*************************************************
 * GAME: HỨNG QUÀ CÙNG ÔNG GIÀ NOEL
 *************************************************/
(function game() {
  const cv = $("game");
  const ctx = cv.getContext("2d");
  const W = 400,
    H = 520;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * dpr;
  cv.height = H * dpr;
  ctx.scale(dpr, dpr);

  const GOAL = 150;
  const DURATION = 45;
  const TYPES = [
    { e: "🎁", pts: 10, w: 55 },
    { e: "⭐", pts: 20, w: 22 },
    { e: "❤️", pts: 30, w: 8 },
    { e: "🪨", pts: 0, w: 22, bad: true },
  ];
  const wsum = TYPES.reduce((s, t) => s + t.w, 0);
  const pickType = () => {
    let r = Math.random() * wsum;
    for (const t of TYPES) if ((r -= t.w) < 0) return t;
    return TYPES[0];
  };

  const overlay = $("gameOverlay");
  let running = false;
  let score, lives, timeLeft, items, spawnT, last, px, targetX, elapsed, fx;
  let losses = 0;

  const flakes = Array.from({ length: 30 }, () => ({
    x: rand(0, W),
    y: rand(0, H),
    r: rand(1, 2.5),
  }));

  function reset() {
    score = 0;
    lives = 3;
    timeLeft = DURATION;
    items = [];
    fx = [];
    spawnT = 0;
    elapsed = 0;
    px = targetX = W / 2;
    updateHud();
  }

  function updateHud() {
    $("score").textContent = score;
    $("time").textContent = Math.max(0, Math.ceil(timeLeft));
    $("lives").textContent = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
  }

  /* --- điều khiển --- */
  const keys = {};
  addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      if (running) e.preventDefault();
      keys[e.key] = true;
    }
  });
  addEventListener("keyup", (e) => (keys[e.key] = false));

  function pointerMove(e) {
    const rect = cv.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width) * W;
  }
  cv.addEventListener("pointermove", pointerMove);
  cv.addEventListener("pointerdown", pointerMove);

  /* --- vòng lặp --- */
  function spawn() {
    const t = pickType();
    items.push({
      t,
      x: rand(30, W - 30),
      y: -30,
      vy: rand(130, 190) + elapsed * 3.2,
      rot: rand(-1, 1),
      a: 0,
    });
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;
    timeLeft -= dt;

    // di chuyển người chơi
    if (keys.ArrowLeft) targetX -= 420 * dt;
    if (keys.ArrowRight) targetX += 420 * dt;
    targetX = Math.max(34, Math.min(W - 34, targetX));
    px += (targetX - px) * Math.min(1, dt * 14);

    spawnT -= dt;
    if (spawnT <= 0) {
      spawn();
      spawnT = Math.max(0.35, 0.85 - elapsed * 0.01);
    }

    const py = H - 56;
    items.forEach((it) => {
      it.y += it.vy * dt;
      it.a += it.rot * dt;
      // va chạm với giỏ (ông già Noel)
      if (
        !it.done &&
        it.y > py - 20 &&
        it.y < py + 30 &&
        Math.abs(it.x - px) < 46
      ) {
        it.done = true;
        if (it.t.bad) {
          lives--;
          fx.push({ x: it.x, y: it.y, txt: "💥 Ouch!", life: 0.8 });
        } else {
          score += it.t.pts;
          fx.push({ x: it.x, y: it.y, txt: "+" + it.t.pts, life: 0.7 });
        }
        updateHud();
      }
    });
    items = items.filter((it) => !it.done && it.y < H + 40);
    fx.forEach((f) => {
      f.life -= dt;
      f.y -= 40 * dt;
    });
    fx = fx.filter((f) => f.life > 0);
    updateHud();

    draw();

    if (score >= GOAL) return end(true);
    if (lives <= 0 || timeLeft <= 0) return end(false);
    requestAnimationFrame(loop);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // tuyết nền
    ctx.fillStyle = "rgba(255,255,255,.6)";
    flakes.forEach((f) => {
      f.y += f.r * 0.4;
      if (f.y > H) f.y = 0;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, 7);
      ctx.fill();
    });
    // nền tuyết
    ctx.fillStyle = "#eaf3ff";
    ctx.beginPath();
    ctx.ellipse(W / 2, H + 10, W * 0.75, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    items.forEach((it) => {
      ctx.save();
      ctx.translate(it.x, it.y);
      ctx.rotate(it.a * 0.6);
      ctx.font = "34px serif";
      ctx.fillText(it.t.e, 0, 0);
      ctx.restore();
    });

    // ông già Noel + giỏ
    ctx.font = "54px serif";
    ctx.fillText("🎅", px, H - 62);
    ctx.font = "36px serif";
    ctx.fillText("🧺", px, H - 24);

    ctx.font = "bold 18px Quicksand, sans-serif";
    ctx.fillStyle = "#ffd86b";
    fx.forEach((f) => {
      ctx.globalAlpha = Math.min(1, f.life * 2);
      ctx.fillText(f.txt, f.x, f.y);
    });
    ctx.globalAlpha = 1;
  }

  function end(win) {
    running = false;
    overlay.classList.remove("off");
    $("startGame").textContent = "🔄 Chơi lại";
    if (win) {
      $("ovTitle").textContent = "Em giỏi quá! 🎉";
      $("ovText").innerHTML =
        `Em được <b>${score}</b> điểm.<br>Món quà bí mật đã được mở khóa rồi đó 🎁`;
      unlockGift();
      const r = cv.getBoundingClientRect();
      [0, 250, 500].forEach((d) =>
        setTimeout(
          () =>
            sparkle(
              r.left + rand(60, r.width - 60),
              r.top + rand(60, 240),
              30,
              140,
            ),
          d,
        ),
      );
    } else {
      losses++;
      $("ovTitle").textContent = "Tiếc quá, thử lại nha 🥺";
      $("ovText").innerHTML =
        `Em được <b>${score}</b>/${GOAL} điểm.` +
        (losses >= 2 ? "<br>Anh cho em mở quà luôn nè, vì em đáng yêu 😘" : "");
      if (losses >= 2) unlockGift();
    }
  }

  $("startGame").addEventListener("click", () => {
    reset();
    overlay.classList.add("off");
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  });

  reset();
  draw();
})();

/*************************************************
 * QUÀ
 *************************************************/
const giftBtn = $("giftBtn");
function unlockGift() {
  giftBtn.disabled = false;
  giftBtn.classList.remove("locked");
  $("giftLock").textContent = "🔓 Quà đã sẵn sàng, mở đi em!";
}

giftBtn.addEventListener("click", () => {
  if (giftBtn.disabled) return;
  giftBtn.style.display = "none";
  $("giftLock").style.display = "none";
  $("finalMessage").classList.remove("hidden");
  setTimeout(
    () =>
      $("finalMessage").scrollIntoView({ behavior: "smooth", block: "center" }),
    200,
  );
  if (!playing) setPlaying(true);
  startFalling();
  startFireworks();
});

const fallImages = [
  "gift",
  "hat",
  "bell",
  "candycane",
  "snowman",
  "stocking",
  "tree",
  "gingerbread",
  "holly",
  "star",
].map((n) => `xmas/${n}.svg`);
let fallTimer, fwTimer;
function startFalling() {
  if (fallTimer) return;
  fallTimer = setInterval(() => {
    const img = document.createElement("img");
    img.src = pick(fallImages);
    img.className = "fall-item";
    img.alt = "";
    img.style.left = rand(0, innerWidth - 60) + "px";
    img.style.animationDuration = rand(8, 14) + "s";
    document.body.appendChild(img);
    setTimeout(() => img.remove(), 15000);
  }, 900);
}
function startFireworks() {
  if (fwTimer) return;
  fwTimer = setInterval(
    () =>
      sparkle(
        innerWidth * rand(0.15, 0.85),
        innerHeight * rand(0.15, 0.5),
        28,
        130,
      ),
    1000,
  );
}

/*************************************************
 * TRANG TRÍ HAI BÊN (màn hình rộng)
 *************************************************/
(function sides() {
  const decor = {
    sideL: [
      ["snowman", 8, 0],
      ["gift", 30, 1.2],
      ["candycane", 52, 0.6],
      ["tree", 74, 1.8],
    ],
    sideR: [
      ["stocking", 10, 0.8],
      ["bell", 32, 0],
      ["gingerbread", 54, 1.4],
      ["holly", 76, 0.4],
    ],
  };
  const colors = ["#ffe066", "#ff4d6d", "#6ee7ff", "#ff9ff3", "#7dff9b"];

  Object.entries(decor).forEach(([id, items]) => {
    const box = $(id);
    // dây đèn nhấp nháy chạy dọc mép
    const string = document.createElement("div");
    string.className = "side-string";
    for (let i = 0; i < 26; i++) {
      const b = document.createElement("i");
      b.style.background = colors[i % colors.length];
      b.style.color = colors[i % colors.length];
      b.style.animationDelay = i * 0.12 + "s";
      b.style.marginLeft = Math.sin(i * 0.7) * 6 + "px";
      string.appendChild(b);
    }
    box.appendChild(string);
    // icon bồng bềnh
    items.forEach(([name, top, delay]) => {
      const img = document.createElement("img");
      img.src = `xmas/${name}.svg`;
      img.alt = "";
      img.className = "side-icon";
      img.style.top = top + "%";
      img.style.animationDelay = delay + "s";
      img.addEventListener("click", (e) => {
        sparkle(e.clientX, e.clientY, 14, 70);
        floatText(
          e.clientX,
          e.clientY,
          pick(["Ho ho ho 🎅", "Merry Xmas!", "Yêu em ❤️"]),
        );
      });
      box.appendChild(img);
    });
  });
})();

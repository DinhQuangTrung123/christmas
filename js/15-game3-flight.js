/*************************************************
 * GAME 3: CHUYẾN BAY CỦA ÔNG GIÀ NOEL (khó nhất, 5 mạng)
 *************************************************/
(function flightGame() {
  const cv = $("flightCanvas");
  const ctx = cv.getContext("2d");
  const W = 400, H = 440;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * dpr;
  cv.height = H * dpr;
  ctx.scale(dpr, dpr);

  const GOAL = 30; // số cổng cần vượt qua
  const PX = 110; // vị trí ngang cố định của xe tuyết
  const R = 14; // bán kính va chạm
  const PW = 54; // bề rộng cột
  const SPACING = 230; // khoảng cách giữa các cổng
  const GRAVITY = 1500;
  const FLAP = -450;

  const overlay = $("flOverlay");
  let running = false;
  const MAX_LIVES = 5;
  let py, vy, gates, items, speed, gap, level, passed, hearts, lives, shield;
  let invuln, t, last, spawnX, texts, tilt;

  // hoa văn kẹo gậy cho cột
  const pat = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 24;
    const g = c.getContext("2d");
    g.fillStyle = "#fff";
    g.fillRect(0, 0, 24, 24);
    g.fillStyle = "#e8283c";
    g.beginPath();
    g.moveTo(0, 12); g.lineTo(12, 0); g.lineTo(24, 0); g.lineTo(0, 24);
    g.closePath(); g.fill();
    g.beginPath();
    g.moveTo(24, 12); g.lineTo(24, 24); g.lineTo(12, 24);
    g.closePath(); g.fill();
    return ctx.createPattern(c, "repeat");
  })();

  const stars = Array.from({ length: 40 }, () => ({ x: rand(0, W), y: rand(0, H * 0.7), r: rand(0.6, 1.8) }));
  const snow = Array.from({ length: 40 }, () => ({ x: rand(0, W), y: rand(0, H), r: rand(1, 2.5), s: rand(20, 60) }));

  function best() {
    try { return +localStorage.getItem("g2best") || 0; } catch (e) { return 0; }
  }
  function saveBest(v) {
    try { localStorage.setItem("g2best", v); } catch (e) {}
  }
  function showBest() {
    const b = best();
    $("flBest").textContent = b ? `🏆 Kỷ lục của em: ${b} cổng` : "";
  }

  function reset() {
    py = H / 2; vy = 0; tilt = 0;
    gates = []; items = []; texts = [];
    passed = 0; hearts = 0; lives = MAX_LIVES; shield = false;
    level = 1; speed = 150; gap = 200;
    invuln = 0; t = 0;
    spawnX = W + 140;
    hud();
  }

  function hud() {
    $("flGates").textContent = passed;
    $("flHearts").textContent = hearts;
    $("flLives").textContent = "❤️".repeat(lives) + "🖤".repeat(MAX_LIVES - lives) + (shield ? " 🛡️" : "");
    $("flLevel").textContent = "Cấp " + level;
  }

  const gateY = (g) => g.base + g.amp * Math.sin(t * g.freq + g.phase);

  function spawnGate() {
    const margin = gap / 2 + 50;
    const g = {
      x: spawnX,
      base: rand(margin, H - margin),
      amp: level >= 3 ? Math.min(20 + (level - 3) * 8, 55) : 0,
      freq: rand(1.4, 2.2),
      phase: rand(0, 6.28),
      gap,
      done: false,
    };
    gates.push(g);
    // trái tim đặt gần mép cổng => phải mạo hiểm
    if (Math.random() < 0.75) {
      const side = Math.random() < 0.5 ? -1 : 1;
      items.push({ type: "heart", x: g.x + PW / 2, g, off: side * (gap / 2 - 26), y: 0 });
    }
    // khiên giữa hai cổng
    if (!shield && Math.random() < 0.16) {
      items.push({ type: "star", x: g.x + SPACING / 2 + PW / 2, y: rand(110, H - 110), g: null });
    }
    spawnX += SPACING;
  }

  function say(txt, x = PX, y = py - 30) {
    texts.push({ txt, x, y, life: 1 });
  }

  function hit(reason) {
    if (invuln > 0) return;
    if (shield) {
      shield = false;
      invuln = 0.9;
      say("🛡️ Khiên vỡ!");
    } else {
      lives--;
      invuln = 1.6;
      say("💥 Ouch!");
    }
    if (reason === "bound") { py = H / 2; vy = 0; }
    hud();
    if (lives <= 0) end(false);
  }

  function flap() {
    if (!running) return;
    vy = FLAP;
  }
  // Chuột / bút: pointerdown. Cảm ứng: touchstart + chặn cuộn trang (iOS bỏ qua touch-action: none)
  const box = $("flightBox");
  cv.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch") flap();
  });
  box.addEventListener(
    "touchstart",
    (e) => {
      if (!running) return;
      e.preventDefault();
      flap();
    },
    { passive: false },
  );
  box.addEventListener(
    "touchmove",
    (e) => {
      if (running) e.preventDefault();
    },
    { passive: false },
  );
  addEventListener("keydown", (e) => {
    if (running && (e.code === "Space" || e.key === "ArrowUp")) {
      e.preventDefault();
      flap();
    }
  });

  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.04);
    last = now;
    t += dt;
    if (invuln > 0) invuln -= dt;

    // vật lý
    vy = Math.min(vy + GRAVITY * dt, 620);
    py += vy * dt;
    tilt += ((Math.max(-0.5, Math.min(0.9, vy / 600))) - tilt) * Math.min(1, dt * 10);

    // cấp độ: nhanh dần, cổng hẹp dần, từ cấp 3 cổng dao động
    level = 1 + Math.floor(passed / 5);
    speed = Math.min(150 + (level - 1) * 22, 300);
    gap = Math.max(132, 200 - (level - 1) * 11);

    // sinh cổng
    spawnX -= speed * dt;
    while (spawnX < W + 80) spawnGate();

    gates.forEach((g) => {
      g.x -= speed * dt;
      const gy = gateY(g);
      // va chạm cột
      if (PX + R > g.x && PX - R < g.x + PW) {
        if (py - R < gy - g.gap / 2 || py + R > gy + g.gap / 2) hit("pipe");
      }
      if (!g.done && g.x + PW < PX - R) {
        g.done = true;
        passed++;
        if (passed % 5 === 0 && passed < GOAL) say(`⚡ Cấp ${1 + passed / 5}!`, W / 2, 140);
        hud();
      }
    });
    gates = gates.filter((g) => g.x > -PW - 10);

    items.forEach((it) => {
      if (it.g) { it.x = it.g.x + PW / 2; it.y = gateY(it.g) + it.off; }
      else it.x -= speed * dt;
      if (!it.got && Math.hypot(it.x - PX, it.y - py) < 26) {
        it.got = true;
        if (it.type === "heart") { hearts++; say("+💖", it.x, it.y); }
        else { shield = true; say("🛡️ Khiên!", it.x, it.y); }
        hud();
      }
    });
    items = items.filter((it) => !it.got && it.x > -30);

    if (py < R || py > H - 34) hit("bound");

    texts.forEach((x) => { x.life -= dt; x.y -= 40 * dt; });
    texts = texts.filter((x) => x.life > 0);

    draw();

    if (passed >= GOAL) return end(true);
    if (running) requestAnimationFrame(loop);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // sao + trăng
    ctx.fillStyle = "#fff";
    stars.forEach((s) => {
      ctx.globalAlpha = 0.4 + 0.5 * Math.abs(Math.sin(t * 1.5 + s.x));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.font = "44px serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🌙", W - 60, 70);

    // tuyết (parallax nhanh theo tốc độ)
    ctx.fillStyle = "rgba(255,255,255,.6)";
    snow.forEach((f) => {
      f.x -= (running ? speed : 40) * 0.0 + f.s * 0.02;
      f.y += f.s * 0.016;
      if (f.y > H) { f.y = 0; f.x = rand(0, W); }
      if (f.x < 0) f.x = W;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 7); ctx.fill();
    });

    // cột kẹo gậy
    gates.forEach((g) => {
      const gy = gateY(g);
      const top = gy - g.gap / 2, bot = gy + g.gap / 2;
      ctx.fillStyle = pat;
      ctx.fillRect(g.x, 0, PW, top);
      ctx.fillRect(g.x, bot, PW, H - bot);
      ctx.fillStyle = "#e8283c";
      ctx.fillRect(g.x - 6, top - 16, PW + 12, 16);
      ctx.fillRect(g.x - 6, bot, PW + 12, 16);
      ctx.fillStyle = "#fff";
      ctx.fillRect(g.x - 6, top - 16, PW + 12, 4);
      ctx.fillRect(g.x - 6, bot, PW + 12, 4);
    });

    // mặt đất tuyết
    ctx.fillStyle = "#eaf3ff";
    ctx.fillRect(0, H - 24, W, 24);
    ctx.beginPath();
    ctx.ellipse(W / 2, H - 22, W * 0.8, 10, 0, 0, 7);
    ctx.fill();

    // vật phẩm
    ctx.font = "28px serif";
    items.forEach((it) => {
      ctx.save();
      ctx.translate(it.x, it.y);
      const s = 1 + 0.12 * Math.sin(t * 6);
      ctx.scale(s, s);
      ctx.fillText(it.type === "heart" ? "❤️" : "⭐", 0, 0);
      ctx.restore();
    });

    // xe tuyết (tuần lộc quay đầu về hướng bay)
    ctx.save();
    if (invuln > 0 && Math.floor(invuln * 12) % 2 === 0) ctx.globalAlpha = 0.35;
    ctx.translate(PX, py);
    ctx.rotate(tilt * 0.5);
    ctx.scale(-1, 1);
    ctx.font = "26px serif";
    ctx.fillText("🦌", -26, 0);
    ctx.fillText("🛷", 4, 4);
    ctx.fillText("🎅", 4, -14);
    if (shield) {
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = "#7df9ff";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(-8, 0, 30, 0, 7); ctx.stroke();
    }
    ctx.restore();

    ctx.font = "bold 18px Quicksand, sans-serif";
    ctx.fillStyle = "#ffd86b";
    texts.forEach((x) => { ctx.globalAlpha = Math.min(1, x.life * 2); ctx.fillText(x.txt, x.x, x.y); });
    ctx.globalAlpha = 1;
  }

  function end(win) {
    running = false;
    overlay.classList.remove("off");
    $("flStart").textContent = "🔄 Bay lại";
    if (passed > best()) saveBest(passed);
    showBest();
    const r = cv.getBoundingClientRect();
    if (win) {
      $("flTitle").textContent = "Em là phi công giỏi nhất! 🏆";
      $("flText").innerHTML = `Vượt ${GOAL} cổng, nhặt được <b>${hearts}</b> 💖<br>Em đã vượt qua cả 3 thử thách! Mở quà thôi nào 🎁`;
      stageDone(2);
      [0, 250, 500, 800].forEach((d) =>
        setTimeout(() => sparkle(r.left + rand(60, r.width - 60), r.top + rand(60, 260), 30, 140), d),
      );
    } else {
      $("flTitle").textContent = "Rơi mất rồi 🥺";
      $("flText").innerHTML = `Em vượt được <b>${passed}</b>/${GOAL} cổng, nhặt <b>${hearts}</b> 💖<br>Thử lại nha, anh tin em làm được!`;
      setSurrender("surrenderFlight", 2, true);
    }
  }

  $("flStart").addEventListener("click", () => {
    reset();
    overlay.classList.add("off");
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  });

  // chơi lại sau khi đã qua hết 3 màn
  const initOv = [$("flTitle").innerHTML, $("flText").innerHTML, $("flStart").textContent];
  replayHooks[2] = () => {
    running = false;
    reset();
    draw();
    $("flTitle").innerHTML = initOv[0];
    $("flText").innerHTML = initOv[1];
    $("flStart").textContent = initOv[2];
    $("flStart").classList.remove("hidden");
    overlay.classList.remove("off");
  };

  reset();
  draw();
  showBest();
})();

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

  const GOAL = 200;
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
  // chặn trang bị cuộn khi đang kéo ngón tay trong lúc chơi
  ["touchstart", "touchmove"].forEach((ev) =>
    $("gameBox").addEventListener(
      ev,
      (e) => {
        if (running) e.preventDefault();
      },
      { passive: false },
    ),
  );

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
        `Em được <b>${score}</b> điểm.<br>Qua màn 1 rồi! Chuẩn bị sang thử thách 2 nhé 🚀`;
      stageDone(0);
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
      $("ovTitle").textContent = "Tiếc quá, thử lại nha 🥺";
      $("ovText").innerHTML = `Em được <b>${score}</b>/${GOAL} điểm. Cố lên nào!`;
      setSurrender("surrender1", 0, true);
    }
  }

  $("startGame").addEventListener("click", () => {
    reset();
    overlay.classList.add("off");
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  });

  // chơi lại sau khi đã qua hết 3 màn: đưa màn chơi về trạng thái ban đầu
  const initOv = [$("ovTitle").innerHTML, $("ovText").innerHTML, $("startGame").textContent];
  replayHooks[0] = () => {
    running = false;
    reset();
    draw();
    $("ovTitle").innerHTML = initOv[0];
    $("ovText").innerHTML = initOv[1];
    $("startGame").textContent = initOv[2];
    $("startGame").classList.remove("hidden");
    overlay.classList.remove("off");
  };

  reset();
  draw();
})();

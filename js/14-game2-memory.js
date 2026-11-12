/*************************************************
 * GAME 2: GHÉP ĐÔI KHOẢNH KHẮC (ma trận 5x5, có xáo bài)
 *************************************************/
(function memoryGame() {
  const SIZE = 5; // ma trận 5x5 = 25 ô
  const CENTER = (SIZE * SIZE - 1) / 2; // ô giữa (12) là ô tặng ❤️, không lật được
  const PAIRS = (SIZE * SIZE - 1) / 2; // 12 cặp
  const TIME = 60;
  const MAX_MISS = 10;
  const SHUFFLE_EVERY = 3;
  const PREVIEW = 5; // giây cho xem trước
  let POOL = []; // số ảnh còn tồn tại, lấy từ imagesReady
  let pairs = PAIRS;
  imagesReady.then((nums) => (POOL = nums));

  const grid = $("memGrid");
  const overlay = $("memOverlay");
  let cards, first, lock, found, miss, timeLeft, timer, running;

  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  function hud() {
    $("memPairs").textContent = found;
    $("memTime").textContent = Math.max(0, Math.ceil(timeLeft));
    $("memMiss").textContent = MAX_MISS - miss;
  }

  function build() {
    grid.innerHTML = "";
    // đủ 12 ảnh khác nhau; nếu album ít ảnh hơn thì dùng lặp lại
    const base = shuffle([...POOL]);
    const picks = Array.from({ length: pairs }, (_, k) => base[k % base.length]);
    const faces = shuffle([...picks, ...picks]);
    cards = faces.map((n, k) => {
      const idx = k < CENTER ? k : k + 1; // chừa ô giữa
      const el = document.createElement("button");
      el.className = "mcard";
      el.style.order = idx;
      el.innerHTML =
        `<span class="mface mback">🎄</span>` +
        `<span class="mface mfront"><img src="${imageSrc(n)}" alt="" /></span>`;
      const c = { el, n, open: false, done: false };
      el.addEventListener("click", () => flip(c));
      grid.appendChild(el);
      return c;
    });
    // ô giữa: tặng một trái tim
    const free = document.createElement("div");
    free.className = "mfree";
    free.style.order = CENTER;
    free.textContent = "❤️";
    grid.appendChild(free);
  }

  function setOpen(c, on) {
    c.open = on;
    c.el.classList.toggle("open", on);
  }

  function flip(c) {
    if (!running || lock || c.open || c.done) return;
    setOpen(c, true);
    if (!first) {
      first = c;
      return;
    }
    const a = first;
    first = null;
    if (a.n === c.n) {
      a.done = c.done = true;
      a.el.classList.add("done");
      c.el.classList.add("done");
      found++;
      const r = c.el.getBoundingClientRect();
      sparkle(r.left + r.width / 2, r.top + r.height / 2, 14, 60);
      hud();
      if (found >= pairs) end(true);
    } else {
      lock = true;
      miss++;
      hud();
      setTimeout(() => {
        setOpen(a, false);
        setOpen(c, false);
        lock = false;
        if (miss >= MAX_MISS) return end(false);
        if (miss % SHUFFLE_EVERY === 0) reshuffle();
      }, 750);
    }
  }

  // xáo vị trí các lá chưa ghép được
  function reshuffle() {
    const left = cards.filter((c) => !c.done);
    const orders = shuffle(left.map((c) => +c.el.style.order));
    lock = true;
    left.forEach((c) => c.el.classList.add("shaking"));
    floatText(innerWidth / 2, innerHeight / 2, "🔀 Xáo bài!");
    setTimeout(() => {
      left.forEach((c, i) => {
        c.el.style.order = orders[i];
      });
    }, 350);
    setTimeout(() => {
      left.forEach((c) => c.el.classList.remove("shaking"));
      lock = false;
    }, 800);
  }

  function end(win) {
    running = false;
    clearInterval(timer);
    lock = true;
    overlay.classList.remove("off");
    $("memStart").textContent = "🔄 Chơi lại";
    if (win) {
      $("memTitle").textContent = "Trí nhớ siêu đỉnh! 🧠💖";
      $("memText").innerHTML =
        `Em đã ghép đủ ${pairs} cặp, sai ${miss} lần.<br>Qua màn 2 rồi! Còn thử thách cuối nữa thôi ✈️`;
      const r = grid.getBoundingClientRect();
      [0, 250, 500, 800].forEach((d) =>
        setTimeout(
          () =>
            sparkle(
              r.left + rand(40, r.width - 40),
              r.top + rand(40, r.height - 40),
              30,
              140,
            ),
          d,
        ),
      );
      stageDone(1);
    } else {
      $("memTitle").textContent =
        miss >= MAX_MISS ? "Hết lượt sai rồi 🥺" : "Hết giờ rồi ⏰";
      $("memText").innerHTML =
        `Em ghép được ${found}/${pairs} cặp.<br>Thử lại nha, lần này anh đổi bài cho em!`;
      setSurrender("surrenderMemory", 1, true);
    }
  }

  function start() {
    pairs = PAIRS;
    if (POOL.length < 1) {
      $("memText").textContent =
        "Cần có ảnh trong thư mục images/ để chơi nhé!";
      return;
    }
    $("memTotal").textContent = pairs;
    found = 0;
    miss = 0;
    first = null;
    timeLeft = TIME;
    lock = true;
    running = false;
    build();
    hud();
    overlay.classList.add("off");
    // cho xem trước vài giây
    cards.forEach((c) => setOpen(c, true));
    floatText(innerWidth / 2, innerHeight * 0.4, "👀 Nhớ kỹ nha!");
    setTimeout(() => {
      cards.forEach((c) => setOpen(c, false));
      setTimeout(() => {
        running = true;
        lock = false;
        const t0 = performance.now();
        clearInterval(timer);
        timer = setInterval(() => {
          timeLeft = TIME - (performance.now() - t0) / 1000;
          hud();
          if (timeLeft <= 0 && running) end(false);
        }, 200);
      }, 500);
    }, PREVIEW * 1000);
  }

  $("memStart").addEventListener("click", start);

  // chơi lại sau khi đã qua hết 3 màn: xóa bàn bài, về trạng thái ban đầu
  const initOv = [$("memTitle").innerHTML, $("memText").innerHTML, $("memStart").textContent];
  replayHooks[1] = () => {
    running = false;
    clearInterval(timer);
    grid.innerHTML = "";
    found = 0;
    miss = 0;
    timeLeft = TIME;
    hud();
    $("memTitle").innerHTML = initOv[0];
    $("memText").innerHTML = initOv[1];
    $("memStart").textContent = initOv[2];
    $("memStart").classList.remove("hidden");
    overlay.classList.remove("off");
  };

  found = 0;
  miss = 0;
  timeLeft = TIME;
  hud();
})();

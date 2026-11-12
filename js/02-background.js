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

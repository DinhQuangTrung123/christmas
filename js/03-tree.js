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
    "Anh Thương cô Trinh anh nhiều ❤️",
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

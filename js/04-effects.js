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

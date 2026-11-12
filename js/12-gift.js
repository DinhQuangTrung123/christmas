/*************************************************
 * QUÀ
 *************************************************/
const giftBtn = $("giftBtn");
function unlockGift() {
  giftBtn.disabled = false;
  giftBtn.classList.remove("locked");
  $("giftLock").textContent = "🔓 Em đã vượt qua cả 3 thử thách, mở quà đi!";
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

const fallImages = Array.from(
  { length: 10 },
  (_, i) => `icons/icon${i + 1}.svg`,
);
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

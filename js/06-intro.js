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

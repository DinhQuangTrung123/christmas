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

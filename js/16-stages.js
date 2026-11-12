/*************************************************
 * LUỒNG 3 THỬ THÁCH (hứng quà -> ghép ảnh -> chuyến bay)
 * Thắng màn trước -> ẩn nó (và ẩn nút chơi lại) -> mở màn sau.
 * Qua hết 3 màn -> mở khóa quà + cho chọn chơi lại game nào cũng được.
 *************************************************/
const STAGES = ["gameSection", "memorySection", "flightSection"];
const START_BTNS = ["startGame", "memStart", "flStart"];
const SURRENDER_BTNS = ["surrender1", "surrenderMemory", "surrenderFlight"];
let allCleared = false;

// Gọi khi thắng màn i
function stageDone(i) {
  $(SURRENDER_BTNS[i]).classList.add("hidden");
  if (allCleared) return; // đang chơi lại cho vui: giữ nút chơi lại, không chuyển màn
  $(START_BTNS[i]).classList.add("hidden"); // qua màn rồi thì không cho chơi lại nữa
  stageWon(i);
}

function stageWon(i, delay = 2800) {
  if (allCleared) return;
  setTimeout(() => {
    $(STAGES[i]).classList.add("hidden");
    if (i < STAGES.length - 1) {
      const next = $(STAGES[i + 1]);
      next.classList.remove("hidden");
      next.classList.add("in");
      setTimeout(() => next.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    } else {
      allCleared = true;
      $("replayBox").classList.remove("hidden");
      unlockGift();
      setTimeout(() => $("giftBtn").scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    }
  }, delay);
}

// Nút "Đầu hàng": chỉ hiện sau khi thua, bấm để bỏ qua sang màn kế tiếp
function setSurrender(id, stageIndex, show) {
  const b = $(id);
  b.classList.toggle("hidden", !show || allCleared);
  b.onclick = () => {
    b.classList.add("hidden");
    $(START_BTNS[stageIndex]).classList.add("hidden");
    stageWon(stageIndex, 300);
  };
}

// Sau khi qua hết 3 màn: chọn game muốn chơi lại
document.querySelectorAll("[data-replay]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const i = +btn.dataset.replay;
    STAGES.forEach((id, k) => $(id).classList.toggle("hidden", k !== i));
    document.querySelectorAll("[data-replay]").forEach((b) => b.classList.toggle("on", b === btn));
    if (replayHooks[i]) replayHooks[i]();
    const sec = $(STAGES[i]);
    sec.classList.add("in");
    setTimeout(() => sec.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  });
});

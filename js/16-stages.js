/*************************************************
 * LUỒNG 3 THỬ THÁCH (hứng quà -> ghép ảnh -> chuyến bay): thắng màn trước -> ẩn nó -> mở màn sau
 *************************************************/
const STAGES = ["gameSection", "memorySection", "flightSection"];
function stageWon(i, delay = 2800) {
  setTimeout(() => {
    $(STAGES[i]).classList.add("hidden");
    if (i < STAGES.length - 1) {
      const next = $(STAGES[i + 1]);
      next.classList.remove("hidden");
      next.classList.add("in");
      setTimeout(() => next.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    } else {
      unlockGift();
      setTimeout(() => $("giftBtn").scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    }
  }, delay);
}

// Nút "Đầu hàng": chỉ hiện sau khi thua, bấm để bỏ qua sang màn kế tiếp
function setSurrender(id, stageIndex, show) {
  const b = $(id);
  b.classList.toggle("hidden", !show);
  b.onclick = () => {
    b.classList.add("hidden");
    stageWon(stageIndex, 300);
  };
}

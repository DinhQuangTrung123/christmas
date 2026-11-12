/*************************************************
 * TRANG TRÍ HAI BÊN (màn hình rộng)
 *************************************************/
(function sides() {
  const decor = {
    sideL: [
      [5, 8, 0],
      [1, 30, 1.2],
      [4, 52, 0.6],
      [7, 74, 1.8],
    ],
    sideR: [
      [6, 10, 0.8],
      [3, 32, 0],
      [8, 54, 1.4],
      [9, 76, 0.4],
    ],
  };
  const colors = ["#ffe066", "#ff4d6d", "#6ee7ff", "#ff9ff3", "#7dff9b"];

  Object.entries(decor).forEach(([id, items]) => {
    const box = $(id);
    // dây đèn nhấp nháy chạy dọc mép
    const string = document.createElement("div");
    string.className = "side-string";
    for (let i = 0; i < 26; i++) {
      const b = document.createElement("i");
      b.style.background = colors[i % colors.length];
      b.style.color = colors[i % colors.length];
      b.style.animationDelay = i * 0.12 + "s";
      b.style.marginLeft = Math.sin(i * 0.7) * 6 + "px";
      string.appendChild(b);
    }
    box.appendChild(string);
    // icon bồng bềnh
    items.forEach(([name, top, delay]) => {
      const img = document.createElement("img");
      img.src = `icons/icon${name}.svg`;
      img.alt = "";
      img.className = "side-icon";
      img.style.top = top + "%";
      img.style.animationDelay = delay + "s";
      img.addEventListener("click", (e) => {
        sparkle(e.clientX, e.clientY, 14, 70);
        floatText(
          e.clientX,
          e.clientY,
          pick([
            "Anh Thương cô Trinh anh nhiều ❤️",
            "Merry Xmas!",
            "Yêu em ❤️",
          ]),
        );
      });
      box.appendChild(img);
    });
  });
})();

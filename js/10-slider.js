/*************************************************
 * SLIDER ẢNH
 *************************************************/
(function slider() {
  const slider = $("slider");
  const captions = [
    "Merry Christmas 🎄",
    "Cô Trinh anh xinh nhất mùa đông ❄️",
    "Nụ cười này dễ thương 😊",
    "Cô Trinh của anh 💖",
    "Yêu em nhiều 💖",
    "Mãi bên nhau ngen cô Trinh anh ^^ 💕",
  ];
  let imgs = [];
  let i = 0;
  let timer;

  function show(n) {
    if (!imgs.length) return;
    imgs[i] && imgs[i].classList.remove("active");
    i = (n + imgs.length) % imgs.length;
    imgs[i].classList.add("active");
    $("caption").textContent = captions[i % captions.length];
  }
  function auto() {
    clearInterval(timer);
    timer = setInterval(() => show(i + 1), 4500);
  }

  imagesReady.then((nums) => {
    if (!nums.length) {
      slider.closest(".gallery").classList.add("hidden");
      return;
    }
    // Mỗi lần mở web: xáo ngẫu nhiên thứ tự ảnh (Fisher-Yates)
    const order = [...nums];
    for (let k = order.length - 1; k > 0; k--) {
      const r = Math.floor(Math.random() * (k + 1));
      [order[k], order[r]] = [order[r], order[k]];
    }
    order.forEach((n) => {
      const img = document.createElement("img");
      img.src = imageSrc(n);
      img.alt = "";
      img.loading = "lazy";
      // ảnh nào hỏng/không tải được thì bỏ khỏi album, không để ô đen
      img.addEventListener("error", () => {
        const wasActive = img.classList.contains("active");
        imgs = imgs.filter((x) => x !== img);
        img.remove();
        if (wasActive) show(i);
      });
      slider.appendChild(img);
    });
    imgs = [...slider.querySelectorAll("img")];
    imgs[0].loading = "eager";
    show(0);
    auto();
  });

  $("nextSlide").addEventListener("click", () => {
    show(i + 1);
    auto();
  });
  $("prevSlide").addEventListener("click", () => {
    show(i - 1);
    auto();
  });
})();

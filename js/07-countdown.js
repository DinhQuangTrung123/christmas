/*************************************************
 * COUNTDOWN TỚI NOEL
 *************************************************/
(function countdown() {
  const label = $("cdLabel");
  function tick() {
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, 11, 25, 0, 0, 0);
    const endDay = new Date(year, 11, 26, 0, 0, 0);
    if (now >= target && now < endDay) {
      ["cdD", "cdH", "cdM", "cdS"].forEach((id) => ($(id).textContent = 0));
      label.textContent = "🎄 Hôm nay là Giáng Sinh rồi! Merry Christmas! 🎅";
      return;
    }
    if (now >= endDay) target = new Date(year + 1, 11, 25, 0, 0, 0);
    const diff = target - now;
    $("cdD").textContent = Math.floor(diff / 864e5);
    $("cdH").textContent = Math.floor((diff / 36e5) % 24);
    $("cdM").textContent = Math.floor((diff / 6e4) % 60);
    $("cdS").textContent = Math.floor((diff / 1e3) % 60);
  }
  tick();
  setInterval(tick, 1000);
})();

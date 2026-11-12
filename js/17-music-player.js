/*************************************************
 * TRÌNH PHÁT NHẠC: bấm biểu tượng loa -> mở bảng điều khiển
 * (phát/tạm dừng, bài trước/sau, tua, âm lượng, chọn bài trong danh sách)
 * Tên bài + ca sĩ đọc từ thẻ ID3 trong file mp3; không có thì hiện "Bài N".
 *************************************************/
(function musicPlayer() {
  const panel = $("musicPanel");
  const listEl = $("mpList");
  const seek = $("mpSeek");
  const meta = {}; // số bài -> { title, artist }
  const fmt = (s) =>
    isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00";

  /* ---------- mở / đóng bảng ---------- */
  function openPanel(on) {
    panel.classList.toggle("open", on);
    musicToggle.classList.toggle("open", on);
  }
  musicToggle.addEventListener("click", () => openPanel(!panel.classList.contains("open")));
  $("mpClose").addEventListener("click", () => openPanel(false));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") openPanel(false);
  });

  /* ---------- danh sách bài ---------- */
  const titleOf = (n, i) => (meta[n] && meta[n].title) || `Bài ${i + 1}`;

  function render() {
    listEl.innerHTML = "";
    playlist.forEach((n, i) => {
      const li = document.createElement("li");
      if (i === track) li.className = "on";
      li.innerHTML =
        '<span class="mp-num"></span><span class="mp-info"><b></b><small></small></span>' +
        '<span class="mp-eq"><i></i><i></i><i></i></span>';
      li.querySelector(".mp-num").textContent = i + 1;
      li.querySelector("b").textContent = titleOf(n, i);
      li.querySelector("small").textContent = (meta[n] && meta[n].artist) || "";
      li.addEventListener("click", () => playTrack(i));
      listEl.appendChild(li);
    });
    document.querySelector(".mp-head span").textContent = `🎵 Nhạc Giáng Sinh · ${playlist.length} bài`;
    const n = playlist[track];
    $("mpTitle").textContent = titleOf(n, track);
    $("mpArtist").textContent = (meta[n] && meta[n].artist) || "";
    const on = listEl.querySelector("li.on");
    if (on) on.scrollIntoView({ block: "nearest" });
  }
  window.addEventListener("musicchange", render);

  /* ---------- nút điều khiển ---------- */
  $("mpPlay").addEventListener("click", () => setPlaying(!playing));
  $("mpPrev").addEventListener("click", () => playTrack(track - 1));
  $("mpNext").addEventListener("click", () => playTrack(track + 1));
  $("mpVol").addEventListener("input", (e) => (music.volume = e.target.value / 100));

  seek.addEventListener("input", () => {
    if (isFinite(music.duration)) music.currentTime = (seek.value / 1000) * music.duration;
  });
  music.addEventListener("timeupdate", () => {
    $("mpCur").textContent = fmt(music.currentTime);
    if (isFinite(music.duration) && document.activeElement !== seek) {
      seek.value = (music.currentTime / music.duration) * 1000;
    }
  });
  music.addEventListener("loadedmetadata", () => ($("mpDur").textContent = fmt(music.duration)));

  function syncPlayState() {
    const on = !music.paused;
    panel.classList.toggle("is-playing", on);
    $("mpPlay").textContent = on ? "⏸" : "▶";
    musicToggle.textContent = on ? "🔊" : "🔇";
  }
  ["play", "pause", "playing", "ended"].forEach((ev) => music.addEventListener(ev, syncPlayState));

  /* ---------- đọc tên bài từ thẻ ID3v2 (chỉ tải vài chục KB đầu file) ---------- */
  function parseId3(buf) {
    const b = new Uint8Array(buf);
    if (b.length < 10 || String.fromCharCode(b[0], b[1], b[2]) !== "ID3") return {};
    const ver = b[3];
    const synch = (o) => (b[o] << 21) | (b[o + 1] << 14) | (b[o + 2] << 7) | b[o + 3];
    const end = Math.min(10 + synch(6), b.length);
    const out = {};
    const text = (s, e) => {
      if (e <= s) return "";
      const enc = b[s];
      const d = b.subarray(s + 1, e);
      let str = "";
      try {
        if (enc === 1 || enc === 2) {
          const be = enc === 2 || (d[0] === 0xfe && d[1] === 0xff);
          str = new TextDecoder(be ? "utf-16be" : "utf-16le").decode(d);
        } else str = new TextDecoder(enc === 3 ? "utf-8" : "windows-1252").decode(d);
      } catch (err) {}
      return str.replace(/^﻿/, "").replace(/\0+$/g, "").trim();
    };
    let i = 10;
    while (i + 10 <= end) {
      const id = String.fromCharCode(b[i], b[i + 1], b[i + 2], b[i + 3]);
      if (!/^[A-Z0-9]{4}$/.test(id)) break;
      const size =
        ver === 4 ? synch(i + 4) : ((b[i + 4] << 24) | (b[i + 5] << 16) | (b[i + 6] << 8) | b[i + 7]) >>> 0;
      if (id === "TIT2") out.title = text(i + 10, i + 10 + size);
      if (id === "TPE1") out.artist = text(i + 10, i + 10 + size);
      i += 10 + size;
    }
    return out;
  }

  // tải phần đầu file (dừng ngay khi đủ thẻ ID3, không tải cả bài)
  async function readTags(n) {
    const ctl = new AbortController();
    try {
      const res = await fetch(audioSrc(n), { signal: ctl.signal });
      const reader = res.body.getReader();
      let got = new Uint8Array(0);
      let need = 10;
      while (got.length < need) {
        const { value, done } = await reader.read();
        if (done) break;
        const next = new Uint8Array(got.length + value.length);
        next.set(got);
        next.set(value, got.length);
        got = next;
        if (got.length >= 10 && need === 10) {
          const sz = ((got[6] << 21) | (got[7] << 14) | (got[8] << 7) | got[9]) + 10;
          need = Math.min(sz, 400000);
        }
      }
      ctl.abort();
      return parseId3(got.buffer);
    } catch (e) {
      return {};
    }
  }

  tracksReady.then(async (list) => {
    await Promise.all(
      list.map(async (n) => {
        meta[n] = await readTags(n);
        render();
      }),
    );
  });

  render();
  syncPlayState();
})();

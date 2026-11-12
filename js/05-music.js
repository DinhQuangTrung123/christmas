/*************************************************
 * NHẠC
 * Phát tuần tự audio/music1.mp3, music2.mp3, ... (tăng dần), hết bài cuối thì
 * quay lại bài đầu. Trang tự dò file nào còn tồn tại, nên xóa/thiếu số vẫn ổn.
 *************************************************/
const music = $("music");
const musicToggle = $("musicToggle");
const AUDIO_MAX = 50; // dò music1 ... music50
const audioSrc = (n) => `audio/music${n}.mp3`;

let playlist = [1]; // tạm thời, cập nhật ngay khi dò xong
let track = 0; // vị trí trong playlist
let playing = false;
let errorsInRow = 0;

music.volume = 0.7;
music.src = audioSrc(playlist[track]);

// Dò các file nhạc còn tồn tại (giữ thứ tự số tăng dần)
const tracksReady = (async () => {
  // Dò bằng thẻ audio (dùng khi fetch bị chặn, ví dụ mở thẳng file:// bằng cách nhấp đúp)
  const probeAudio = (n) =>
    new Promise((res) => {
      const a = new Audio();
      let done = false;
      const fin = (v) => {
        if (done) return;
        done = true;
        a.removeAttribute("src");
        res(v);
      };
      a.preload = "metadata";
      a.onloadedmetadata = () => fin(true);
      a.onerror = () => fin(false);
      setTimeout(() => fin(false), 4000);
      a.src = audioSrc(n);
    });
  const exists = async (n) => {
    try {
      const r = await fetch(audioSrc(n), { method: "HEAD", cache: "no-cache" });
      if (r.status === 405 || r.status === 501) return probeAudio(n); // server không hỗ trợ HEAD
      const type = r.headers.get("content-type") || "";
      return r.ok && !type.includes("text/html");
    } catch (e) {
      return probeAudio(n);
    }
  };
  const flags = await Promise.all(
    Array.from({ length: AUDIO_MAX }, (_, i) => exists(i + 1)),
  );
  return flags.map((ok, i) => (ok ? i + 1 : 0)).filter(Boolean);
})();

tracksReady.then((list) => {
  if (!list.length) return;
  const current = playlist[track];
  playlist = list;
  const idx = list.indexOf(current);
  if (idx >= 0) {
    track = idx; // đang ở bài nào thì giữ nguyên vị trí
  } else {
    track = 0;
    music.src = audioSrc(playlist[0]);
    if (playing) music.play().catch(() => {});
  }
  window.dispatchEvent(new Event("musicchange"));
});

function playTrack(i) {
  track = (i + playlist.length) % playlist.length;
  music.src = audioSrc(playlist[track]);
  playing = true;
  musicToggle.textContent = "🔊";
  music.play().catch(() => {});
  window.dispatchEvent(new Event("musicchange"));
}

// hết bài -> bài kế tiếp theo thứ tự
music.addEventListener("ended", () => {
  errorsInRow = 0;
  playTrack(track + 1);
});

// file hỏng/không tải được -> bỏ qua sang bài sau (không lặp vô hạn)
music.addEventListener("error", () => {
  errorsInRow++;
  if (errorsInRow >= playlist.length) return;
  playTrack(track + 1);
});
music.addEventListener("playing", () => (errorsInRow = 0));

function setPlaying(on) {
  playing = on;
  musicToggle.textContent = on ? "🔊" : "🔇";
  if (on) music.play().catch(() => (musicToggle.textContent = "🔇"));
  else music.pause();
}
// Bấm biểu tượng loa => mở/đóng bảng điều khiển nhạc (xem js/17-music-player.js)

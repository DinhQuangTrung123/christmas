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
  const exists = async (n) => {
    try {
      const r = await fetch(audioSrc(n), { method: "HEAD", cache: "no-cache" });
      return r.ok && (r.headers.get("content-type") || "").startsWith("audio");
    } catch (e) {
      return false; // mở trực tiếp file:// thì không dò được, dùng bài đầu + xử lý lỗi
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
});

function playTrack(i) {
  track = (i + playlist.length) % playlist.length;
  music.src = audioSrc(playlist[track]);
  music.play().catch(() => {});
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
musicToggle.addEventListener("click", () => setPlaying(!playing));

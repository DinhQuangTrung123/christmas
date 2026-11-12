/*************************************************
 * HELPERS
 *************************************************/
const $ = (id) => document.getElementById(id);
const rand = (a, b) => Math.random() * (b - a) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const SVGNS = "http://www.w3.org/2000/svg";

// Ảnh nằm trong images/ với tên image1.jpg, image2.jpg, ... (số bất kỳ, có thể thiếu số).
// Trang tự dò xem ảnh nào còn tồn tại, nên xóa ảnh nào cũng không bị ô đen.
// Chỉ cần đổi IMAGE_MAX nếu sau này có số ảnh lớn hơn 100.
const IMAGE_MAX = 100;
const imageSrc = (n) => `images/image${n}.jpg`;

// Promise trả về mảng số ảnh còn tồn tại, ví dụ [1, 2, 5, 6, ...]
const imagesReady = (async () => {
  const exists = async (n) => {
    try {
      const r = await fetch(imageSrc(n), { method: "HEAD", cache: "no-cache" });
      return r.ok && (r.headers.get("content-type") || "").startsWith("image");
    } catch (e) {
      // mở trực tiếp file:// thì fetch bị chặn => dò bằng thẻ ảnh
      return new Promise((res) => {
        const im = new Image();
        im.onload = () => res(true);
        im.onerror = () => res(false);
        im.src = imageSrc(n);
      });
    }
  };
  const flags = await Promise.all(
    Array.from({ length: IMAGE_MAX }, (_, i) => exists(i + 1)),
  );
  return flags.map((ok, i) => (ok ? i + 1 : 0)).filter(Boolean);
})();

// Mỗi game đăng ký hàm "chuẩn bị chơi lại" ở đây (replayHooks[0..2]), dùng sau khi qua hết 3 màn
const replayHooks = [];

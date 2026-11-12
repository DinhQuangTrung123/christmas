# Merry Christmas 🎄

Trang web Giáng Sinh tĩnh (HTML + CSS + JS thuần, không cần build). Mở `index.html` bằng server tĩnh bất kỳ, ví dụ:

```bash
python3 -m http.server 8000
```

## Cấu trúc

```
index.html        # toàn bộ nội dung trang (các section)
css/              # style, đánh số theo thứ tự nạp (thứ tự quan trọng)
js/               # script, đánh số theo thứ tự nạp (script thường, dùng chung biến toàn cục)
images/           # image1.jpg, image2.jpg, ... (ảnh album)
icons/            # icon1.svg, icon2.svg, ... (icon Giáng Sinh)
audio/            # music1.mp3, music2.mp3, ... (nhạc nền)
```

| File JS | Việc |
|---|---|
| `01-utils.js` | hàm tiện ích + dò ảnh còn tồn tại trong `images/` (`imagesReady`) |
| `02-background.js` | sao + tuyết rơi |
| `03-tree.js` | cây thông (đèn, bóng, chạm để nhảy) |
| `04-effects.js` | `sparkle`, `floatText` |
| `05-music.js` | phát nhạc tuần tự `audio/musicN.mp3` (tự dò file) |
| `06-intro.js` | phong bì mở thiệp + dòng chữ gõ |
| `07-countdown.js` | đếm ngược đến Noel |
| `08-wishes.js` / `09-reveal.js` | lời nhắn, hiệu ứng hiện khi cuộn |
| `10-slider.js` | album ảnh |
| `11-game1-catch.js` | thử thách 1: hứng quà |
| `12-gift.js` | mở khóa/mở quà, icon rơi, pháo hoa |
| `13-side-decor.js` | trang trí hai bên (màn hình rộng) |
| `14-game2-memory.js` | thử thách 2: ghép đôi ảnh |
| `15-game3-flight.js` | thử thách 3: chuyến bay của ông già Noel |
| `16-stages.js` | luồng 3 thử thách (`STAGES`: thắng màn trước → ẩn → mở màn sau) + nút đầu hàng |

## Việc hay làm

- **Thêm/xóa ảnh:** chỉ cần bỏ/xóa file `imageN.jpg` (N từ 1 đến 100, không cần liền số) trong `images/`. Trang tự dò ảnh còn tồn tại, nên xóa ảnh nào cũng không bị ô đen. Dùng `.jpg` (không dùng `.heic`). Nếu cần số lớn hơn 100 thì tăng `IMAGE_MAX` trong `js/01-utils.js`.
- **Thêm/đổi nhạc:** bỏ `musicN.mp3` (N từ 1 đến 50) vào `audio/`. Nhạc phát tuần tự theo số tăng dần (music1, music2, ...), hết bài cuối thì quay lại bài đầu. Trang tự dò file còn tồn tại nên không cần sửa code.
- **Chỉnh độ khó game:** các hằng số ở đầu mỗi file game (`GOAL`, `TIME`, `MAX_MISS`, ...).
- **Đổi lời chúc / thư / phiếu thưởng:** sửa trong `index.html` và `js/08-wishes.js`.
- **Thêm file JS/CSS mới:** thêm thẻ `<script>`/`<link>` trong `index.html` đúng vị trí thứ tự nạp.

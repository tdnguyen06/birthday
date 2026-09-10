# 🎞️ Mixtape 2006 • Happy Birthday Bìm

Dự án trang web chúc mừng sinh nhật phong cách hoài niệm Vintage Cassette & Cuộn phim 35mm.

## 🎮 Hệ Thống Trò Chơi & Màn Trải Nghiệm

1. **Màn 1: Máy phát băng Cassette Deck 2006**
   - Nhập mã bí mật: `100906`, `10092006`, `1009`, `bìm`, hoặc `bim`.
2. **Màn 2: Cuộn phim 35mm hoài niệm**
   - Lướt xem 7 khoảnh khắc kỷ niệm dạng khung phim analog.
3. **Màn 3: Chuỗi 3 Thử Thách Minigames liên tiếp**
   - **Game 1 (Piano Tiles)**: Bấm các nốt nhạc piano rơi xuống theo nhịp điệu (hỗ trợ phím D, F, J, K hoặc 1, 2, 3, 4 hoặc chạm trực tiếp). Nếu bấm hụt hoặc để rơi quá 5 lần (5 mạng) sẽ thua. Đạt 20 điểm để qua màn.
   - **Game 2 (Ghi nhớ nốt nhạc - Simon Piano)**: Lắng nghe máy phát và bấm lại chuỗi nốt: Vòng 1 (6 nốt) → Vòng 2 (8 nốt) → Vòng 3 (10 nốt). Nhớ sai quá 3 lần (3 mạng) sẽ bị loại.
   - **Game 3 (Flappy Melody)**: Chạm màn hình, click chuột hoặc ấn phím `Space` để bay qua 10 cột chướng ngại vật vintage.
   - **Màn Thổi Nến**: Chạm vào ngọn nến để thổi tắt điều ước tuổi mới.
4. **Màn 4: Bức thư máy đánh chữ & Con dấu sáp**
   - Hiệu ứng gõ chữ từng ký tự chân thực kèm con dấu sáp ấn tượng.
5. **⭐ Trò chơi bí mật (Ấn ngôi sao góc dưới bên trái)**:
   - "Đoán Bông Hoa Đẹp Nhất": Chọn các loài hoa, sau 3 lần chọn sẽ bật mí điều bất ngờ cùng album 8 bức ảnh đáng nhớ!

---

## 🚀 Hướng Dẫn Deploy Lên GitHub Pages Không Bị Lỗi

Để website hoạt động 100% không bị lỗi đường dẫn hay mất ảnh khi đưa lên GitHub:

### Bước 1: Đẩy mã nguồn lên GitHub Repository
Chạy các lệnh sau trong thư mục dự án:
```bash
git add .
git commit -m "Update minigames and fix GitHub Pages compatibility"
git push origin main
```

### Bước 2: Bật GitHub Pages
1. Truy cập vào kho lưu trữ GitHub của bạn trên trình duyệt (ví dụ: `https://github.com/username/repository-name`).
2. Nhấn vào tab **Settings** (ở thanh menu phía trên).
3. Ở cột bên trái, chọn mục **Pages** (thuộc nhóm *Code and automation*).
4. Tại mục **Build and deployment**:
   - **Source**: Chọn `Deploy from a branch`.
   - **Branch**: Chọn nhánh `main` (hoặc `master`), và thư mục chọn `/ (root)`.
5. Nhấn nút **Save**.

### Bước 3: Truy cập trang web
- Sau 1 - 2 phút, GitHub sẽ hiển thị đường link trang web của bạn:
  `https://username.github.io/repository-name/`
- Trang web được xây dựng với đường dẫn tương đối (relative paths) chuẩn và Web Audio API tích hợp sẵn, không phụ thuộc server ngoài nên sẽ chạy mượt mà trên cả máy tính lẫn điện thoại.

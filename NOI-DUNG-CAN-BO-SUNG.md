# Nội dung cần bổ sung

Danh sách những nội dung trên website hiện đang là **tạm / giả định / còn thiếu**, cần thay bằng thông tin thật.
Đánh dấu `[x]` khi đã xong. *Cập nhật: 09/11/2026.*

**Mức ưu tiên:** 🔴 cần làm sớm · 🟡 nên có · 🟢 bổ sung dần

**Ở đâu sửa:**
- **Admin**: tự sửa tại `https://www.thietbinhamay-dd.com/admin` — hướng dẫn có ảnh: `/huong-dan-quan-tri.html`.
- **Supabase**: chạy file SQL trong *SQL Editor*.
- **Vercel**: *Settings → Environment Variables*, xong bấm *Redeploy*.
- **Code**: gửi nội dung cho người phát triển.

---

## 0. Việc kỹ thuật cần làm ngay

| Xong | Ưu tiên | Việc | Ở đâu | Ghi chú |
|---|---|---|---|---|
| [ ] | 🔴 | Chạy `supabase/migrations/0009_sua-chu-hoa-mo-ta.sql` | Supabase | Sửa “pLC/cB” → “PLC/CB” trong mô tả 8 sản phẩm (bỏ qua nếu đã chạy) |
| [x] | 🔴 | Chạy `supabase/migrations/0010_tim-kiem-khong-dau.sql` | Supabase | ✅ Đã chạy — tìm kiếm không dấu (“bien tan” → “Biến tần”) |
| [x] | 🔴 | Chạy `supabase/migrations/0011_hang-chu-luc.sql` | Supabase | ✅ Đã chạy — chọn *Thương hiệu tiêu biểu* trong Admin → Thương hiệu (hiện ở khung logo trang chủ, trang Sản phẩm, menu) |
| [ ] | 🔴 | Thêm biến `NEXT_PUBLIC_SITE_URL = https://www.thietbinhamay-dd.com` rồi Redeploy | Vercel | Để link chia sẻ Zalo/Facebook, sitemap dùng đúng tên miền |
| [ ] | 🔴 | Tạo tài khoản admin `phuong.le@thietbinhamay-dd.com` và cấp quyền | Supabase | Xem README mục 3 hoặc hướng dẫn có ảnh |
| [x] | 🔴 | Chạy `0008_hinh-anh-thuc-te.sql` | Supabase | ✅ Đã chạy: 62 thương hiệu · 123 sản phẩm · 118 ảnh thật · 43 danh mục có ảnh |
| [x] | 🔴 | Gắn tên miền | Vercel | ✅ `www.thietbinhamay-dd.com` |
| [ ] | 🟡 | Thêm `CRON_SECRET` (nếu chưa) | Vercel | Bảo vệ cron giữ Supabase không bị tạm dừng |

## 1. Thông tin công ty — Admin → Cài đặt

| Xong | Ưu tiên | Nội dung | Hiện tại | Cần bổ sung |
|---|---|---|---|---|
| [x] | 🔴 | **Tên công ty chính thức** | ✅ Theo giấy chứng nhận ĐKDN (kèm tên tiếng Anh) | — |
| [x] | 🔴 | **Logo** | ✅ Logo ngang `Logo_Dat Danh _final_ngang_3.png` ở header; logo `Logo_Dat Danh _final_3.png` ở footer, Giới thiệu, admin, ảnh chia sẻ, file Excel | — |
| [x] | 🔴 | **Mã số thuế** | ✅ MST 0319753015 ở chân trang | — |
| [ ] | 🔴 | **Email liên hệ** | Chưa có (đang ẩn) | Email nhận báo giá, ví dụ `sales@thietbinhamay-dd.com` |
| [ ] | 🟡 | **Giờ làm việc** | Tạm ghi *Thứ 2 – Thứ 7: 7:30 – 17:30* | Giờ làm việc thực tế |
| [ ] | 🟡 | **Bản đồ Google Maps** | Đã có tọa độ QHWV+GH (10.796313, 106.593938) — cần dán vào Admin | Admin → Cài đặt → ô *Link Google Maps*: dán `https://www.google.com/maps?q=10.796313,106.593938&z=17&hl=vi&output=embed` hoặc cả mã nhúng `<iframe…>` (Google Maps → Chia sẻ → Nhúng bản đồ) |
| [ ] | 🟡 | **Số Zalo** | 0907 646 647 | Xác nhận số Zalo nhận tin |
| [ ] | 🟡 | **Facebook / Fanpage, Messenger** | Chưa có (đang ẩn) | Link fanpage và `https://m.me/ten-fanpage` |
| [ ] | 🟡 | **Giới thiệu công ty** | Đoạn văn chung, tự viết | 2–4 đoạn: năm thành lập, kinh nghiệm, kho hàng, khách hàng tiêu biểu, thế mạnh, cam kết |
| [ ] | 🟡 | **Sứ mệnh, Tầm nhìn, Giá trị cốt lõi** | Bản nháp | Viết lại theo định hướng công ty |
| [ ] | 🟢 | **Khẩu hiệu** | *Chuyên cung cấp vật tư nhà máy* (hiện trên hero) | Giữ hoặc đổi (mẫu thiết kế ghi “Giải pháp toàn diện về thiết bị công nghiệp”) |

## 2. Sản phẩm — Admin → Sản phẩm

| Xong | Ưu tiên | Nội dung | Hiện tại | Cần bổ sung |
|---|---|---|---|---|
| [x] | 🔴 | **Ảnh sản phẩm thật** | ✅ 118/123 sản phẩm có ảnh thật (từ “Hình ảnh đưa web.xlsx”) | — |
| [ ] | 🔴 | **Kiểm tra 113 sản phẩm mới** | Tên tự đặt theo ảnh + mã trong file (VD “Contactor Schneider TeSys D LC1D”); mô tả chung; giá “Liên hệ báo giá”; tình trạng “Đặt hàng” | Sửa tên cho đúng mã đang bán; tích **Còn hàng** cho mã có sẵn; xóa mã không kinh doanh |
| [ ] | 🔴 | **5 sản phẩm mẫu cũ còn ảnh vẽ** | Mitsubishi FR-E800, Omron, Festo, SMC, van bi inox (sau 0010 không còn “nổi bật”) | Thay ảnh thật hoặc xóa |
| [ ] | 🟡 | **Mã hàng, thông số kỹ thuật, datasheet** | Hầu hết trống (chỉ PLC S7-1200 có bảng thông số) | Nhập dần cho mã bán chạy — giúp khách và Google tìm thấy |
| [ ] | 🟡 | **Sản phẩm nổi bật** | 8 sản phẩm có ảnh thật được chọn tạm | Chọn 4–8 mặt hàng bán chạy |
| [ ] | 🟢 | **Ảnh lớn hơn** | Ảnh gốc trong file Excel chỉ ~200–300px | Ảnh ≥ 800×800px, nền trắng, dưới 4MB |

## 3. Danh mục — Admin → Danh mục

| Xong | Ưu tiên | Nội dung | Hiện tại | Cần bổ sung |
|---|---|---|---|---|
| [x] | 🔴 | **Cây danh mục** | ✅ 17 nhóm, 64 danh mục con (theo lqe.com.vn) | Xác nhận, thêm/bớt nếu cần |
| [x] | 🟢 | **Ảnh danh mục** | ✅ 43 nhóm/danh mục con có ảnh thật | Thêm cho nhóm còn trống (ATS, Chống sét, Tủ điện, Biến dòng – Đồng hồ đo…) |
| [ ] | 🔴 | **33 danh mục chưa có sản phẩm** | ACB, RCCB–RCBO, cầu dao cách ly, cầu dao đảo chiều, contactor tụ bù, relay bán dẫn, bộ điều khiển nhiệt độ, ATS (3), biến dòng, đồng hồ Ampe–Vôn, công tơ, cầu chì trung thế, chống sét (3), máng nhựa – thanh ray, busbar, co nhiệt – đầu cos, tủ điện (4), bộ lọc – điều áp, đầu nối – ống hơi, thủy lực, hộp số, quạt hút, van bướm, van một chiều, co – tê – rắc co, mặt bích | Gửi ảnh/danh sách hàng để bổ sung, hoặc xóa danh mục không kinh doanh |
| [ ] | 🟡 | **Mô tả danh mục** | Tự viết | Liệt kê đúng các loại hàng công ty bán |

## 4. Thương hiệu — Admin → Thương hiệu

| Xong | Ưu tiên | Nội dung | Hiện tại | Cần bổ sung |
|---|---|---|---|---|
| [x] | 🔴 | **Danh sách hãng** | ✅ 62 hãng (60 logo từ file Excel + Mitsubishi logo cũ; CHINT chưa có logo) | Xác nhận công ty cung cấp hàng các hãng này |
| [ ] | 🟡 | **Logo IDEC, CHINT** | Đang hiện bằng chữ (logo IDEC trong file dính khung chọn) | Logo PNG/SVG nền trong suốt |
| [ ] | 🟢 | **Giấy chứng nhận đại lý** | Chưa có | Nếu là đại lý/nhà phân phối chính thức → đưa lên website |

## 5. Trang chủ & trang Giới thiệu

| Xong | Ưu tiên | Nội dung | Hiện tại | Cần bổ sung |
|---|---|---|---|---|
| [x] | 🔴 | **Ảnh hero / slider** | ✅ Nền ảnh nhà máy + ảnh sản phẩm thật trên 3 slide | — |
| [ ] | 🔴 | **“Vì sao chọn chúng tôi”** | Hàng chính hãng · Báo giá nhanh · Giao hàng tận nơi · Tư vấn kỹ thuật | Cam kết cụ thể hơn (VD “báo giá trong 2 giờ”, “giao trong ngày tại TP.HCM”) |
| [ ] | 🟡 | **Số liệu** | 62+ thương hiệu · 17 nhóm · 64+ danh mục · Miễn phí tư vấn (tự đếm) | Số năm kinh nghiệm, số nhà máy đã phục vụ, số mã hàng tồn kho |
| [ ] | 🟡 | **Quy trình 4 bước** | Gửi yêu cầu → Tư vấn chọn mã → Nhận báo giá → Giao hàng | Đúng quy trình thực tế? |
| [ ] | 🟡 | **Ảnh công ty** | Chưa có | Mặt tiền, kho hàng, đội ngũ, xe giao hàng — tăng uy tín hơn ảnh sản phẩm |

## 6. Dịch vụ, chính sách, tin tức — Admin

| Xong | Ưu tiên | Nội dung | Hiện tại | Cần bổ sung |
|---|---|---|---|---|
| [ ] | 🔴 | **Dịch vụ** | 5 dịch vụ mẫu | Xác nhận; thêm nếu có lắp tủ điện, lập trình PLC, sửa chữa… |
| [ ] | 🔴 | **4 trang chính sách** | Bản nháp chung | Điều kiện thực tế: thời gian bảo hành, phí giao hàng, đổi trả, bảo mật |
| [ ] | 🟡 | **3 bài tin tức mẫu** | Kiến thức kỹ thuật chung | Giữ/sửa/thay; nên đăng 2–4 bài/tháng cho SEO |
| [ ] | 🟢 | **Thanh thông báo** | “Báo giá nhanh vật tư nhà máy — gọi hotline…” | Đổi nội dung hoặc để trống để ẩn |

## 7. Chức năng nên có thêm

| Xong | Ưu tiên | Nội dung | Ghi chú |
|---|---|---|---|
| [ ] | 🔴 | **Thông báo khi có yêu cầu báo giá** | Hiện chỉ lưu trong Admin → *Yêu cầu báo giá*, không ai được báo. Chọn kênh: email / Zalo / Telegram |
| [ ] | 🟡 | **Nhập sản phẩm hàng loạt từ Excel** | Gửi file Excel (Tên · Mã · Hãng · Danh mục · Mô tả · Giá · Ảnh) → tạo lệnh SQL nhập một lần |
| [ ] | 🟢 | **Khách hàng / dự án tiêu biểu** | Logo hoặc tên nhà máy đã cung cấp (cần đồng ý của khách) |
| [ ] | 🟢 | **Catalogue / bảng giá PDF** | File tải về cho khách |
| [ ] | 🟢 | **Ảnh chia sẻ Facebook/Zalo riêng** | Hiện dùng logo; có thể làm ảnh 1200×630px |

## 8. Quảng bá

| Xong | Ưu tiên | Nội dung | Ghi chú |
|---|---|---|---|
| [x] | 🔴 | **Tên miền riêng** | ✅ `www.thietbinhamay-dd.com` |
| [ ] | 🟡 | **Google Search Console** | Khai báo website + gửi `https://www.thietbinhamay-dd.com/sitemap.xml` |
| [ ] | 🟡 | **Google Business Profile** | Đăng ký doanh nghiệp trên Google Maps |
| [ ] | 🟢 | **PageSpeed Insights** | Đo tốc độ bản thật tại pagespeed.web.dev |

---

## Cách gửi nội dung

- **Thông tin chữ**: điền thẳng vào file này (cột “Cần bổ sung”) hoặc gửi file Word/Excel.
- **Ảnh**: đặt tên file theo mã hàng (VD `6ES7214-1AG40-0XB0.jpg`), gom theo danh mục; hoặc dán vào Excel như file “Hình ảnh đưa web”.
- **Danh sách sản phẩm nhiều**: Excel với các cột *Tên · Mã hàng · Thương hiệu · Danh mục · Mô tả ngắn · Thông số · Giá · Tên file ảnh* — nhập hàng loạt thay vì nhập tay.

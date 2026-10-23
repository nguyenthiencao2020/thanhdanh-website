---
title: Site Structure Audit - Đạt Danh Factory Supplies
url: https://thanhdanh-website.vercel.app/
sitemap_url: https://thanhdanh-website.vercel.app/sitemap.xml
platform: Custom (Next.js 15 + Supabase, host Vercel)
theme: Custom (Tailwind CSS 4)
language: vi
type: site-structure-audit
audited_at: 2026-10-23
audited_by: Claude (đối chiếu theo cấu trúc lqe.com.vn – Ref/tham-khao-lqe-sitemap.md)
---

# Site Structure Audit: Đạt Danh Factory Supplies

**Website:** https://thanhdanh-website.vercel.app/ (tạm thời, chưa có tên miền riêng)  
**Sitemap:** `/sitemap.xml` (tự sinh, gồm trang tĩnh, danh mục, sản phẩm, bài viết, chính sách)  
**Nền tảng:** Next.js 15 (App Router) · Supabase (Postgres + Storage + Auth làm CMS) · Vercel  
**Theme:** Tự thiết kế — màu xanh thép / đỏ theo logo, phong cách “bản vẽ kỹ thuật”, bánh răng chuyển động  
**Ngày kiểm tra:** 2026-10-23

---

## 1. Tổng quan

- **Mục đích website:** Giới thiệu Công ty TNHH Thương mại Vật tư Nhà máy Đạt Danh, trưng bày danh mục vật tư nhà máy và thu **yêu cầu báo giá** (form, hotline, Zalo).
- **Đối tượng người dùng:** Phòng mua hàng, kỹ thuật, bảo trì của nhà máy / xưởng sản xuất; nhà thầu cơ điện.
- **Ngôn ngữ:** Tiếng Việt.
- **Ghi chú chung:** Toàn bộ nội dung (sản phẩm, danh mục, thương hiệu, tin tức, dịch vụ, chính sách, thông tin công ty) sửa được tại `/admin`. Nội dung hiện tại một phần là **mẫu** — xem `NOI-DUNG-CAN-BO-SUNG.md`.

---

## 2. Cấu trúc trang chủ (`/`)

Bố cục gọn 7 section (~5,4 màn hình desktop, ~5,6 màn hình mobile; trước đó 12,7 và 21).

| # | Section | Mô tả | Loại block | Ghi chú |
|---|---------|-------|------------|---------|
| 1 | Hero Slider | 3 slide tự chuyển, CTA + hotline; ảnh minh họa và ô số liệu chỉ hiện trên màn hình lớn | Hero Slider | Admin → Banner trang chủ |
| 2 | Thương hiệu | Logo 13 hãng có màu, chạy ngang | Logo Carousel | Giữ theo yêu cầu |
| 3 | Danh mục | 8 nhóm chính cùng một kiểu ô (icon + số danh mục) + “Xem tất cả 17 nhóm”; mobile: 1 hàng trượt ngang | Icon Grid | |
| 4 | Sản phẩm nổi bật | Một khối duy nhất, tab theo nhóm (Tất cả · Đóng cắt · …); mobile: trượt ngang | Tabs + Product Grid | Thay cho 9 khối “theo danh mục” |
| 5 | Về chúng tôi + Vì sao chọn + Quy trình | Đoạn giới thiệu, 4 lợi ích, 4 bước đặt hàng | Text + Feature Grid + Steps | Nền tối |
| 6 | Tin tức | 3 bài mới; mobile trượt ngang | Blog Grid | |
| 7 | CTA | “Liên hệ ngay để được tư vấn & báo giá” | CTA Banner | |

**Quy ước giao diện:** màu đỏ chỉ cho nút hành động chính; tiêu đề nhỏ, nhãn, icon dùng xanh thép/xám.
**Mobile:** thanh cố định dưới đáy *Gọi · Zalo · Báo giá* (thay nút nổi); bộ lọc sản phẩm trong khung “Bộ lọc”;
footer dạng accordion; tab chi tiết sản phẩm trống được ẩn.

---

## 3. Cấu trúc các trang chính

### 3.1. Trang Giới thiệu (`/gioi-thieu`)

| # | Section | Mô tả | Loại block | Ghi chú |
|---|---------|-------|------------|---------|
| 1 | Banner tiêu đề | Breadcrumb + “Về Đạt Danh” | Page Header | |
| 2 | Giới thiệu công ty | Tên công ty, đoạn giới thiệu, số liệu, nút liên hệ; logo bên phải | Text + Image | |
| 3 | Sứ mệnh & Tầm nhìn | 2 thẻ màu | Card x2 | Sửa trong Cài đặt |
| 4 | Giá trị cốt lõi | Uy tín – Chất lượng – Tận tâm – Nhanh chóng | Icon Grid | Sửa trong Cài đặt |
| 5 | Lĩnh vực cung cấp | Danh mục sản phẩm dạng thẻ ảnh | Grid | |
| 6 | CTA | “Hợp tác cùng Đạt Danh” | CTA Banner | |

### 3.2. Trang Liên hệ (`/lien-he`)

| # | Section | Mô tả | Loại block | Ghi chú |
|---|---------|-------|------------|---------|
| 1 | Banner tiêu đề | Breadcrumb + “Liên hệ – Báo giá” | Page Header | |
| 2 | Form yêu cầu | Họ tên, SĐT, email, công ty, nội dung + ghi chú phản hồi | Form | Lưu vào bảng `inquiries` |
| 3 | Thông tin liên hệ | Địa chỉ, 2 hotline, email, Zalo, giờ làm việc | Info Card | |
| 4 | Bản đồ | Google Maps nhúng | Map | |

### 3.3. Trang Danh mục sản phẩm (`/san-pham`, `/danh-muc-san-pham/{slug}`)

| # | Section | Mô tả | Loại block | Ghi chú |
|---|---------|-------|------------|---------|
| 1 | Banner tiêu đề | Breadcrumb, tên + mô tả danh mục | Page Header | Tiêu đề SEO riêng mỗi danh mục |
| 2 | Sidebar | Ô tìm kiếm, danh mục (icon), lọc thương hiệu | Sidebar | Dính khi cuộn (desktop) |
| 3 | Thanh công cụ | Số kết quả + sắp xếp: Nổi bật / Mới nhất / Tên A→Z | Toolbar | |
| 4 | Lưới sản phẩm | Ảnh, danh mục, tên, mô tả, giá / “Liên hệ báo giá” | Product Grid | 12 sản phẩm/trang |
| 5 | Phân trang | | Pagination | |
| 6 | CTA | “Không tìm thấy sản phẩm bạn cần?” | CTA Banner | |

### 3.4. Trang Chi tiết sản phẩm (`/san-pham/{slug}`)

| # | Section | Mô tả | Loại block | Ghi chú |
|---|---------|-------|------------|---------|
| 1 | Breadcrumb | Trang chủ › Sản phẩm › Danh mục › Tên | Breadcrumb | |
| 2 | Gallery | Ảnh chính + ảnh thu nhỏ | Gallery | Ảnh phụ thêm trong Admin |
| 3 | Thông tin chính | Logo hãng, tên (H1), mã, tình trạng (Còn hàng / Đặt hàng), giá, mô tả ngắn | Info | |
| 4 | Nút CTA | Yêu cầu báo giá · Gọi ngay · Zalo | CTA | |
| 5 | Chính sách nhanh | Bảo hành · Giao hàng · Đổi trả (link tới trang chính sách) | Icon Row | |
| 6 | Form báo giá | Gắn sẵn tên sản phẩm | Form | |
| 7 | Tabs | Mô tả chi tiết · Thông số kỹ thuật (bảng) · Tài liệu / Datasheet (PDF) | Tabs | |
| 8 | Sản phẩm cùng danh mục | Tối đa 8, trượt ngang | Carousel | |

### 3.5. Trang Tin tức (`/tin-tuc`, `/tin-tuc/{slug}`)

| # | Section | Mô tả | Loại block | Ghi chú |
|---|---------|-------|------------|---------|
| 1 | Banner tiêu đề | Breadcrumb + “Tin tức” | Page Header | |
| 2 | Bài nổi bật | 1 bài lớn đầu trang | Featured Post | |
| 3 | Lưới bài viết | Ảnh, danh mục, ngày, tiêu đề, tóm tắt, “Đọc tiếp” | Blog Grid | 9 bài/trang + phân trang |
| 4 | Sidebar | Tìm bài, danh mục tin, bài mới nhất, thẻ | Sidebar | Lọc `?danh-muc=`, `?tag=` |
| 5 | Chi tiết bài | Breadcrumb, danh mục, H1, ngày, tác giả, ảnh, nội dung, thẻ, chia sẻ (Facebook / Zalo / sao chép link) | Article | |
| 6 | Bài liên quan + CTA | 3 bài cùng danh mục | Blog Grid | |

### 3.6. Trang khác

| Trang | Section |
|-------|---------|
| Dịch vụ `/dich-vu` | Banner · 5 dịch vụ (thẻ đánh số) · Quy trình 5 bước · Form “Đặt lịch tư vấn” · CTA |
| Thương hiệu `/thuong-hieu` | Banner · lưới logo hãng (link lọc sản phẩm) |
| Chính sách `/chinh-sach-bao-hanh`, `/chinh-sach-van-chuyen`, `/chinh-sach-doi-tra`, `/chinh-sach-bao-mat` | Banner + breadcrumb · menu chính sách bên trái · nội dung · CTA “Cần hỗ trợ thêm?” |
| Tìm kiếm `/tim-kiem?q=` | Banner “Kết quả tìm kiếm cho: …” · ô tìm · kết quả sản phẩm + bài viết |
| 404 | Thông báo · ô tìm kiếm · nút về trang chủ / xem sản phẩm |

---

## 4. Thành phần dùng chung (Global Components)

- [x] **Header / Menu chính:** Thanh trên (khẩu hiệu, email, Zalo, Facebook, hotline) · logo · menu *Trang chủ / Giới thiệu / Sản phẩm (menu thả xuống: danh mục + thương hiệu) / Dịch vụ / Tin tức / Liên hệ* · nút “Báo giá nhanh”. Menu gọn trên mobile. Header dính khi cuộn.
- [x] **Thanh tìm kiếm:** Trong header (tìm sản phẩm + bài viết → `/tim-kiem`), trong sidebar trang sản phẩm và tin tức.
- [x] **Hotline / Zalo / Chat:** Nút nổi góc phải: Gọi (hiệu ứng sóng), Zalo, Messenger (khi có link).
- [x] **Footer:** Logo, tên công ty, tên tiếng Anh, MST, địa chỉ, giờ làm việc · cột Liên hệ · cột Sản phẩm · cột Chính sách + Thông tin · bản đồ · copyright.
- [x] **Breadcrumb:** Có, trên mọi trang con.
- [x] **Nút Back to top:** Có (góc trái dưới, hiện khi cuộn quá 600px).
- [x] **Popup / Banner quảng cáo:** Thanh thông báo trên cùng (không dùng popup che nội dung).

---

## 5. Danh mục sản phẩm / dịch vụ chính

- [x] Thiết bị điện công nghiệp
- [x] Tự động hóa
- [x] Khí nén – Thủy lực
- [x] Motor – Hộp giảm tốc
- [x] Phụ kiện đường ống – Van

**Dịch vụ (nội dung mẫu, cần xác nhận):** Tư vấn chọn thiết bị · Tìm mã thay thế tương đương · Cung cấp vật tư theo dự án · Giao hàng tận nơi · Hỗ trợ kỹ thuật.

---

## 6. Đánh giá nhanh

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| Cấu trúc section rõ ràng | Tốt | Đủ các section như lqe.com.vn, thêm thương hiệu, quy trình, tìm kiếm chung |
| Điều hướng (navigation) | Tốt | Menu thả xuống cho danh mục, breadcrumb, sidebar lọc, link chéo sản phẩm ↔ chính sách |
| Tốc độ tải trang | Tốt (ước tính) | Trang tĩnh + cache 60s (ISR), JS tải lần đầu ~103–112 kB, ảnh minh họa SVG nhẹ. **Chưa đo trên bản thật** — nên chạy PageSpeed Insights sau khi có tên miền |
| Tính responsive | Tốt | Đã kiểm tra màn hình 390px và 1280px |
| SEO cơ bản (title, meta, heading) | Tốt | Mỗi trang có title/description riêng, 1 thẻ H1, sitemap + robots tự sinh, URL tiếng Việt không dấu. Thiếu dữ liệu có cấu trúc (JSON-LD) |
| Khả năng truy cập (accessibility) | Khá | Có `aria-label`, alt ảnh, tôn trọng “giảm chuyển động”, nội dung hiển thị cả khi không có JavaScript. Chưa kiểm tra bằng công cụ chuyên dụng |

---

## 7. Ghi chú & đề xuất

- **Nội dung thật là việc quan trọng nhất còn lại:** sản phẩm, ảnh thật, dịch vụ, chính sách, sứ mệnh — danh sách chi tiết trong `NOI-DUNG-CAN-BO-SUNG.md`.
- **Thông báo yêu cầu báo giá:** hiện chỉ lưu trong Admin; nên thêm gửi email/Zalo/Telegram khi có yêu cầu mới.
- **Tên miền riêng + Google Search Console + Google Business Profile.**
- **Đề xuất kỹ thuật tiếp theo:** JSON-LD (Organization, Product, Article) cho Google; ảnh OG riêng 1200×630; nhập sản phẩm hàng loạt từ Excel.
- **Khác biệt có chủ đích so với LQE:** không có giỏ hàng / bộ lọc giá (B2B báo giá theo mã, giá thường để “Liên hệ”); không có đánh giá/bình luận (cần kiểm duyệt).

---

## 8. Phụ lục

- **Nguồn tham khảo:** https://lqe.com.vn/ (cấu trúc section) — `Ref/tham-khao-lqe-sitemap.md`; mẫu audit trống: `Ref/template-site-audit.md`
- **Công cụ sử dụng:** Đọc mã nguồn, build Next.js, Playwright (chụp màn hình desktop/mobile), Postgres cục bộ (kiểm thử migration + RLS)
- **Lưu ý:** Nội dung có thể thay đổi theo thời điểm; nên kiểm tra lại định kỳ.

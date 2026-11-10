# Kế hoạch: chọn sản phẩm đơn giản, tập trung vào hãng

*Lập ngày 09/11/2026 — ghi lại trước khi sửa để có thể quay lại.*

## 1. Vì sao đổi

- Khách vào trang Sản phẩm thấy cùng lúc **17 nhóm + 64 danh mục con + 62 logo + cột lọc** → rối mắt.
- **33/81 danh mục đang trống** → bấm vào gặp trang “chưa có sản phẩm”.
- Chỉ **17/62 hãng có sản phẩm** trên web: Siemens 43 · Schneider 16 · ABB 9 · ifm 6 · Autonics 6 · CHINT 5 · Weidmüller 5 · SICK 4 · Phoenix Contact 4 · Pepperl+Fuchs 3 · Eaton 3 · Pilz 2 · Mikro 2 · Mitsubishi / Omron / Festo / SMC ~1; 11 sản phẩm chưa gán hãng.
- Khách công nghiệp thường **đã biết mã hàng hoặc hãng** → lối vào chính nên là ô tìm kiếm và hãng, không phải cây danh mục.

## 2. Nguyên tắc

**Mỗi lần khách chỉ phải chọn 1 việc, và chỉ thấy những gì đang có hàng.**

## 3. Thiết kế mới

### Bước 1 — Vào trang Sản phẩm (chưa chọn gì)
1. Ô tìm kiếm lớn giữa trang: “Nhập mã hàng hoặc tên sản phẩm…” (gợi ý: 6ES7214, LC1D18, V20).
2. **Chọn theo hãng**: 8 logo lớn (hãng chủ lực) kèm số sản phẩm.
3. **Hoặc theo loại hàng**: các nhóm **có hàng**, ô có ảnh + số sản phẩm.
4. Dòng “Không thấy mã? → Gửi mã hàng / ảnh tem nhãn để báo giá”.
5. Bên dưới: “Tất cả sản phẩm” (lưới như cũ).

### Bước 2 — Đã chọn hãng hoặc loại
- Một hàng nút lọc duy nhất, **chỉ dòng hàng có hàng, kèm số lượng**:
  - Chọn hãng → các loại hàng của hãng đó (VD Siemens: PLC 6 · Biến tần 6 · HMI 6 · Contactor 4…).
  - Chọn loại → danh mục con có hàng + hàng nút hãng có hàng trong loại đó.
- Nút “← Đổi hãng / Đổi loại” và ô tìm kiếm nhỏ.
- **Bỏ cột lọc bên trái** (cây 17 nhóm, ô chọn thương hiệu).

### Bước 3 — Danh sách sản phẩm
- Giữ thẻ sản phẩm, sắp xếp, phân trang như hiện tại.

### Áp dụng chung
- **Tự ẩn** nhóm / danh mục con / hãng chưa có sản phẩm ở: menu Sản phẩm, trang chủ, trang Sản phẩm, footer. Thêm sản phẩm vào là tự hiện lại. Trang của danh mục trống vẫn mở được qua link cũ.
- **Menu “Sản phẩm” trên header**: ô tìm + 8 hãng chủ lực + các nhóm có hàng (thay bảng 17 nhóm).
- **Trang chủ**, khối “Sản phẩm chúng tôi cung cấp” → 2 hàng **Theo hãng / Theo loại**.
- **Hãng chủ lực**: thêm ô tích *Hãng chủ lực* trong Admin → Thương hiệu (migration `0011`). Chưa chạy 0011 thì web dùng danh sách mặc định bên dưới.

## 4. Lựa chọn mặc định (sửa được sau)

| Câu hỏi | Mặc định |
|---|---|
| 8 hãng chủ lực | Siemens · Schneider Electric · ABB · ifm · Autonics · CHINT · Weidmüller · SICK |
| Loại hàng | **Giữ 17 nhóm hiện tại, chỉ ẩn nhóm trống** (không đổi dữ liệu; còn ~14 nhóm). Gộp còn 8 nhóm để làm sau nếu cần |
| Cột lọc bên trái | Bỏ; thay bằng hàng nút lọc trên đầu danh sách |
| 45 hãng chưa có sản phẩm | Không hiện ở menu / trang Sản phẩm; vẫn ở trang Thương hiệu và dải logo trang chủ |

## 5. Quay lại bản cũ (nếu cần)

- **Mốc trước khi sửa:** commit `5dda12fb4694f86c64ae06c2e09ffabd26fafc8a` trên `main` (PR #28, 09/11/2026).
- **Cách 1 – GitHub:** mở pull request của thay đổi này → nút **Revert** → merge PR revert. Vercel tự deploy lại bản cũ.
- **Cách 2 – Vercel:** *Deployments* → chọn bản deploy trước thay đổi → **⋯ → Promote to Production** (quay lại tức thì, không cần sửa code).
- **Database:** migration `0011` chỉ **thêm** cột `brands.featured`; bản cũ không dùng cột này nên không cần xóa. Muốn xóa: `alter table public.brands drop column if exists featured;`

## 6. Tiến độ (đã triển khai — PR “Trang Sản phẩm đơn giản”)

- [x] Ẩn danh mục / hãng trống
- [x] Trang Sản phẩm 3 bước, bỏ cột lọc trái
- [x] Menu Sản phẩm mới trên header
- [x] Trang chủ: Theo hãng / Theo loại
- [x] Ô *Hãng chủ lực* trong Admin + migration `0011`
- [x] QA máy tính / tablet / điện thoại

### Ghi chú khi triển khai
- Chọn **hãng** → nút lọc theo **nhóm hàng** (không theo danh mục con) để hàng nút ngắn; VD Siemens: Tự động hóa 16 · Biến tần 7 · Contactor 6 · Bộ nguồn 5…
- Chọn **loại** → hàng “Loại” (danh mục con có hàng) + hàng “Hãng” (hãng có hàng trong loại đó).
- Số liệu trang chủ đổi theo hàng thật: “Nhóm sản phẩm” = nhóm có hàng; ô “Danh mục” → “Sản phẩm”.
- Bỏ component cũ: `BrandSelect`, `FilterDrawer`, cây danh mục trong `CatalogNav`.
- Việc của người dùng: chạy `supabase/migrations/0011_hang-chu-luc.sql` để tích/bỏ *Hãng chủ lực* trong Admin (chưa chạy thì web dùng 8 hãng mặc định).

---

## Giai đoạn 2 — Hero chung cho các trang sản phẩm (theo mẫu)

*Lập ngày 09/11/2026, trước khi sửa.*

**Mục tiêu:** thay banner tối đơn giản đầu trang Sản phẩm bằng hero có ảnh, theo mẫu giao diện chủ Đạt Danh gửi.

**Áp dụng cho:** `/san-pham`, `/danh-muc-san-pham/…`, lọc theo hãng (`?thuong-hieu=…`), kết quả tìm kiếm.

**Bố cục hero:**
1. Nền: `public/img/banner/hero-san-pham.jpg` (ảnh AI tủ PLC + robot do khách gửi; đã che chữ “SIEBKNS” in sai trên tủ; bản 1000px cho điện thoại).
2. Dòng nhỏ có gạch: “Cung cấp & Phân phối”.
3. Tiêu đề lớn, phần cuối tô màu nhấn: “Sản phẩm **chính hãng**” / “Sản phẩm **Siemens**” / “**Contactor – Khởi động từ**” / “Kết quả cho **…**”.
4. Câu mô tả ngắn.
5. Ô tìm kiếm bo tròn + nút “Tìm kiếm”.
6. Dải 4 cam kết có icon: Hàng chính hãng · Tư vấn chọn mã · Giao hàng nhanh · Hỗ trợ kỹ thuật.

**Giữ nguyên (khác mẫu, có chủ đích):**
- Màu đỏ / xanh dương của Đạt Danh; chữ nhấn dùng xanh ngọc nhạt hợp với ảnh. Không đổi cả web sang xanh lá.
- Logo, hotline 0907 646 647, email thật (mẫu ghi số / email khác).
- Không ghi “Đại lý chính hãng Siemens” cho tới khi có giấy chứng nhận; không dùng nhãn “Hot Sale” và sắp xếp theo giá (chưa có giá).
- Phần dưới hero (chọn hãng / loại, hàng nút lọc, danh sách) giữ như giai đoạn 1.

**Quay lại:** mốc trước giai đoạn 2 là commit `be5117e75da168545aab3648d5a7e1b692b9c366` trên `main` (PR #30). Cách quay lại như mục 5.

**Tiến độ giai đoạn 2:**
- [x] Hero chung trang sản phẩm (`src/components/ProductHero.tsx`; ảnh đã che thêm nút slider giả AI vẽ ở góc phải dưới)
- [x] QA máy tính / tablet / điện thoại

---

## Giai đoạn 3 — Logo hãng chủ lực nổi bật trên trang chủ (hướng 1)

*09/11/2026 — chủ Đạt Danh muốn trang chủ tạo điểm nhấn logo các hãng; đã duyệt mẫu.*

- Khung trắng **“Thương hiệu chủ lực”** nổi đè lên mép dưới hero: 8 logo hãng chủ lực to, đủ màu, đứng yên; rê chuột hiện số sản phẩm; bấm vào ra sản phẩm của hãng. Điện thoại: lưới 4 × 2.
- Dưới khung: dải **“Và các hãng khác”** chạy ngang, đủ màu (giữ yêu cầu dải logo màu), không trùng 8 hãng chính.
- Khối “Sản phẩm chúng tôi cung cấp” bỏ hàng logo (tránh lặp), chỉ còn theo loại hàng.
- Chấm chuyển slide hero dời lên để khung không che.
- Hãng trong khung = ô *Hãng chủ lực* trong Admin → Thương hiệu (cần migration `0011`), chưa có thì dùng 8 hãng mặc định.
- Lưu ý: laptop màn thấp (~700px) phải cuộn nhẹ mới thấy khung; có thể thu hero hoặc thêm logo trong hero (hướng 2) nếu cần.

**Quay lại:** mốc trước giai đoạn 3 là commit `80a29ef880ad81d498de262188b3d93fef18cb33` trên `main` (PR #31).

- [x] Khung logo hãng chủ lực + dải hãng khác
- [x] Bỏ logo lặp ở khối loại hàng
- [x] QA máy tính / tablet / điện thoại

### Đổi tên “chủ lực” → “Thương hiệu tiêu biểu” (09/11/2026)
Công ty bán nhiều hãng, chữ “chủ lực” dễ hiểu là các hãng khác là phụ. Đã đổi:
- Trang chủ: tiêu đề khung **“Thương hiệu tiêu biểu”**, dòng nhỏ **“Cung cấp thiết bị hơn 60 hãng”** (tự tính theo số hãng).
- Admin → Thương hiệu: ô tích **“Thương hiệu tiêu biểu”** — chọn tối đa 8 hãng bán chạy / khách hỏi nhiều.
- Cột database vẫn là `brands.featured`, file `0011_hang-chu-luc.sql` giữ tên cũ (đã chạy, không cần chạy lại).
- Các mục “hãng chủ lực” ở trên trong file này hiểu là “thương hiệu tiêu biểu”.

---

## QA sau khi phân loại lại (09/11/2026)

- **Trang công khai**: 601 trang (từ trang chủ + sitemap), máy tính & điện thoại — 0 lỗi trang, 0 ảnh hỏng, 0 lỗi JS, 0 tràn ngang.
- **Đã sửa**:
  - Ẩn **45 hãng chưa có sản phẩm** ở dải logo trang chủ và trang Thương hiệu (trang Thương hiệu thêm số sản phẩm + ô “Không thấy hãng bạn cần? → gửi yêu cầu”).
  - Trang Giới thiệu chỉ hiện nhóm có sản phẩm (trước còn link tới nhóm ATS trống).
  - Ví dụ tìm kiếm “6ES7214” (0 kết quả) → “S7-1200”.
  - Link “Xem tất cả 62 hãng” → “Xem tất cả hãng” (trang chỉ hiện hãng có hàng).
- **Admin** (14 trang, đăng nhập Supabase giả lập): đều mở được, không lỗi. Thêm:
  - Tổng quan: “81 danh mục · 48 đang hiện trên web”, “62 thương hiệu · 17 đang hiện trên web”.
  - Danh mục / Thương hiệu: nhãn “N sản phẩm · đang hiện” hoặc “0 sản phẩm · đang ẩn trên web” cho từng mục + dòng cảnh báo số mục đang ẩn.

## Giai đoạn 4 — Sản phẩm theo hãng → dòng hàng

Yêu cầu của Đạt Danh: trang Sản phẩm chia **cột theo hãng**, mỗi hãng các **dòng hàng** (PLC, LOGO! · HMI · Motor · Biến tần · MCB, MCCB · Contactor · Nút nhấn, đèn báo · Cầu chì · Thiết bị đo…), **mỗi dòng 1 ảnh tượng trưng**, không làm chi tiết từng mã.

- Bản nháp: **`tai-lieu/Dong-hang-theo-hang-NHAP.xlsx`** — 53 dòng hàng gộp từ 123 sản phẩm hiện có (Siemens 10, Schneider 6, ABB 5, …, “Hàng thông dụng” 6), có ảnh, cột series, cột Hiện trên web; sheet Thương hiệu: 17 hãng hiện / 45 hãng ẩn.
- Sau khi Đạt Danh duyệt file: thêm bảng/trang dòng hàng, menu & trang Sản phẩm theo cột hãng → dòng, trang dòng hàng (ảnh + series + form báo giá), link sản phẩm cũ chuyển về dòng hàng, Admin mục “Dòng hàng”.

### Bước 4a — Giao diện menu bên trái (đã đưa lên main, 09/11/2026)

**Quay lại:** mốc trước bước 4a là commit `ef1d7942ad4d42975527932f918368f083971809` trên `main` (PR #36, sửa bản đồ).

- `/san-pham`: tổng quan các hãng, mỗi hãng liệt kê dòng hàng; ô tìm kiếm tìm theo dòng hàng / series. `?thuong-hieu=x` chuyển sang `/thuong-hieu/x`, `?danh-muc=x` chuyển sang trang danh mục.
- `/thuong-hieu/[hãng]`: menu trái “Sản phẩm theo hãng” (bấm hãng mở danh sách dòng), bên phải lưới dòng hàng (1 ảnh, series, “Xem & báo giá”).
- `/thuong-hieu/[hãng]/[dòng]`: ảnh, series, form báo giá điền sẵn “Hãng – Dòng”, các dòng khác của hãng.
- Điện thoại: menu thu thành nút “Hãng & dòng hàng”, mở toàn màn hình.
- Dữ liệu tạm: `src/data/product-lines.json` (53 dòng theo file nháp Excel). Sửa dòng hàng hiện phải sửa file này — chưa có trong Admin.
- Trang chi tiết từng mã `/san-pham/[slug]` và trang danh mục vẫn giữ nguyên.

Còn lại (bước 4b, sau khi Đạt Danh chốt file Excel): bảng dòng hàng trên Supabase + Admin “Dòng hàng”, chuyển link sản phẩm cũ về dòng hàng, menu header theo hãng → dòng.

---

## Nhật ký thay đổi sau bước 4a (09/11/2026)

Mỗi dòng: việc đã làm · PR · **mốc quay lại** (commit `main` ngay trước PR đó — `git revert -m 1 <merge>` hoặc khôi phục về mốc).

| PR | Việc | Merge | Mốc trước |
|---|---|---|---|
| #36 | Bản đồ nhận link chia sẻ `maps.app.goo.gl` | `ef1d794` | `f249944` |
| #37 | Bước 4a: Sản phẩm theo hãng → dòng hàng, menu trái; sitemap thêm 18 trang hãng + 53 trang dòng | `60ee2fe` | `ef1d794` |
| #38 | Bấm menu hãng/dòng **không nhảy lên hero** (`KeepScroll` + `scroll={false}`); Giới thiệu 9 lĩnh vực | `4d41c87` | `60ee2fe` |
| #39 | Ô bản đồ Admin nhận cả mã nhúng `<iframe…>`; đọc link chia sẻ chắc hơn | `8cbb1e8` | `4d41c87` |
| #40 | Bản đồ mặc định ghim theo tọa độ Plus Code `QHWV+GH` = **10.796313, 106.593938** | `1a900db` | `8cbb1e8` |
| #41 | **Trang Giới thiệu thiết kế lại** theo mẫu (hero logo, Sứ mệnh xanh / Tầm nhìn đỏ, số liệu, giá trị cốt lõi, lĩnh vực 4 × 2, băng Hợp tác) | `ab3dbb1` | `1a900db` |
| #42 | Link hãng đi thẳng `/thuong-hieu/[hãng]` (bỏ chuyển hướng); sitemap bỏ danh mục trống (còn 48) | `3d90dfa` | `ab3dbb1` |

### Ghi chú
- **Bản đồ trên web thật** lấy từ Admin → Cài đặt (database), không lấy từ code. Cần dán 1 trong 2:
  - `https://www.google.com/maps?q=10.796313,106.593938&z=17&hl=vi&output=embed` (ghim theo tọa độ), hoặc
  - mã nhúng Google Maps → Chia sẻ → Nhúng bản đồ → Sao chép HTML (ghim kèm tên doanh nghiệp).
- **Trang Giới thiệu**: chữ lấy từ Cài đặt (giới thiệu, sứ mệnh, tầm nhìn, giá trị cốt lõi); số liệu tự đếm (hãng có sản phẩm, số dòng hàng, nhóm có sản phẩm). Không dùng chữ/số điện thoại trong ảnh mẫu.
- **Cuộn trang sản phẩm**: link trong vùng menu trái + nội dung giữ vị trí; nếu đầu nội dung bị khuất thì lướt tới ngay dưới header. Menu trên cùng vẫn lên đầu trang.

### QA toàn bộ (09/11/2026, sau PR #42)
- 601 trang công khai, máy tính 1440 + điện thoại 390: 0 lỗi trang, 0 ảnh hỏng, 0 lỗi JS, 0 tràn ngang, 0 link tới trang trống.
- 18 trang hãng + 53 trang dòng + Sản phẩm / tìm kiếm / Giới thiệu: đủ 1 h1, không tràn. Link cũ `?thuong-hieu=` / `?danh-muc=` chuyển đúng; hãng/dòng sai → 404.
- Admin 14 trang (Supabase giả lập), 2 cỡ màn hình: mở được, không lỗi.
- Chưa kiểm tra được từ môi trường thử (bị chặn): web thật, bản đồ Google thật.

### Việc tiếp theo
- [ ] Dán link bản đồ vào Admin → Cài đặt (xem trên) và xem lại trang Liên hệ.
- [ ] Đạt Danh chốt `tai-lieu/Dong-hang-theo-hang-NHAP.xlsx` → bước 4b: bảng dòng hàng + Admin “Dòng hàng”, link sản phẩm cũ về dòng hàng, menu header theo hãng → dòng.

---

## Bước 2–3 theo tư vấn (10/11/2026) — đã duyệt, đưa lên main (cần chạy migration 0012)

**Quay lại:** mốc trước khi làm là commit `1d33f80e95fffb8e5c7b08e250acd767add5348d` trên `main` (PR #44).

### Bước 2 — Nối dòng hàng ↔ sản phẩm, tìm không ra vẫn báo giá được
- Trang dòng hàng: thêm khối **“Sản phẩm trong dòng này”** (thẻ các sản phẩm cũ thuộc dòng) — 123 trang sản phẩm không còn bị tách rời.
- Trang sản phẩm: thêm link **“Thuộc dòng hàng: Hãng – Dòng →”**.
- Tìm kiếm `/san-pham?q=`: hiện cả dòng hàng **và** sản phẩm khớp (tên, mã, mô tả). Không có kết quả → hiện ngay **form báo giá điền sẵn mã vừa gõ**.

### Bước 3 — Gửi ảnh tem nhãn trong form báo giá
- Form báo giá (mọi trang): nút **“Thêm ảnh tem nhãn”**, tối đa 3 ảnh; ảnh được thu nhỏ trên máy khách (~1600px) trước khi gửi.
- Ảnh lưu ở bucket riêng tư `yeu-cau` (không ai xem được bằng link công khai); Admin → Yêu cầu báo giá hiện ảnh thu nhỏ, bấm xem lớn. Xóa yêu cầu thì xóa luôn ảnh.
- Cần chạy migration **`0012_anh-tem-nhan.sql`**. Chưa chạy thì form vẫn gửi được chữ như cũ (ghi chú “khách có gửi ảnh nhưng chưa lưu được”).

### Nhật ký sau bước 2–3 (10/11/2026)

| PR | Việc | Merge | Mốc trước |
|---|---|---|---|
| #45 | **Bước 2–3**: dòng hàng ↔ sản phẩm (khối “Sản phẩm trong dòng này”, link “Thuộc dòng hàng”), tìm kiếm có cả dòng + sản phẩm, tìm không ra → form điền sẵn mã; **gửi ảnh tem nhãn** (tối đa 3, thu nhỏ trên máy khách, bucket riêng tư `yeu-cau`), Admin xem/xóa ảnh | `c4a6aaa` | `1d33f80` |
| #46 | Migration `0012` tự tạo bảng `inquiries` nếu thiếu (khi chạy nhầm project) | `497e59e` | `c4a6aaa` |
| #47 | **QA logic**: trang hãng không 404 khi có sản phẩm mới ngoài dòng hàng (“Sản phẩm khác của hãng”); form báo giá giữ nội dung khi báo lỗi; ô tìm kiếm đầu trang (`/tim-kiem`) có dòng hàng + form điền sẵn mã; “aptomat” ra dòng MCB/MCCB; bỏ 10 tiêu đề trùng, thêm mô tả cho 34 danh mục | `669b0c1` | `497e59e` |
| #48 | Bản production luôn dùng tên miền `https://www.thietbinhamay-dd.com` (dự phòng khi thiếu `NEXT_PUBLIC_SITE_URL`) | `f9a01fa` | `669b0c1` |

**Database:** đã chạy `0012_anh-tem-nhan.sql` trên đúng project (Success). **Vercel:** đã thêm `NEXT_PUBLIC_SITE_URL`, sitemap thật ra đúng tên miền.

**QA sau PR #47–#48:**
- Dữ liệu: 123/123 sản phẩm thuộc đúng 1 dòng hàng, không trùng / thiếu.
- Form báo giá 12/12 tình huống (SĐT sai giữ nội dung, file không phải ảnh bị từ chối, tối đa 3 ảnh, bỏ ảnh, gửi kèm ảnh ~370 KB, form tìm không ra điền sẵn mã, form sản phẩm gắn `product_id`, chặn bot, mobile không tràn).
- Hãng mới / sản phẩm mới thêm từ Admin: trang hãng hiện đúng, không lẫn hãng khác.
- Admin 14 trang × 2 cỡ màn hình; `/admin` chưa đăng nhập → trang đăng nhập.
- 601 trang công khai + 71 trang hãng/dòng: 0 lỗi; 256 URL sitemap đều 200, 0 tiêu đề trùng, 0 trang thiếu mô tả.

**Giới hạn hiện tại:** danh sách dòng hàng vẫn nằm trong `src/data/product-lines.json` (chưa sửa trong Admin); sản phẩm mới thêm qua Admin hiện ở “Sản phẩm khác của hãng” cho tới bước 4b.

**Việc tiếp theo:**
- [ ] Anh/chị thử gửi báo giá kèm ảnh trên web thật → xem trong Admin.
- [ ] Đạt Danh điền `tai-lieu/San-pham-dien-ma-Dat-Danh.xlsx` → em đưa mã lên web (tìm theo mã).
- [ ] Bước 4b: bảng dòng hàng + Admin “Dòng hàng”, menu header theo hãng → dòng.
- [ ] Google Search Console + gửi sitemap — **để sau** (anh/chị làm khi tiện).

### QA toàn diện lần 2 + font (10/11/2026)

| PR | Việc | Merge | Mốc trước |
|---|---|---|---|
| #49 | Cập nhật .md (nhật ký #45–#48), README thêm migration 0012 | `07a5293` | `f9a01fa` |
| #51 | Font: bỏ `font-black` (độ đậm 900 không tải → đậm giả, nhòe trên Windows) ở số liệu trang chủ và số thứ tự trang Dịch vụ. (#50 tự đóng do lỗi kết nối khi gộp, thay bằng #51.) | `87d63d1` | `07a5293` |

**Database:** anh/chị xác nhận đã chạy `0012` (Success) trên đúng project.

**QA toàn diện lần 2 (trên bản main `07a5293`):**
- Quét link không giới hạn: 376 trang duy nhất, 0 link hỏng; 256 URL sitemap đều 200, 0 tiêu đề trùng, 0 trang thiếu mô tả.
- 17 loại trang × máy tính + điện thoại: 0 lỗi JS, `lang="vi"`, ảnh đều có alt, nút/ô nhập đều có nhãn, link gọi điện / Zalo đúng định dạng; dung lượng 0,2–1 MB (trang Sản phẩm ~1,3 MB do ~50 ảnh dòng hàng thu nhỏ — có thể tối ưu sau).
- Admin: 14 trang × 2 cỡ màn hình; mọi trang `/admin/*` khi chưa đăng nhập → trang đăng nhập; 17/17 thao tác ghi đều gọi `requireAdmin`.
- Form báo giá 12/12 tình huống; gửi kèm ảnh → Admin hiện ảnh → xóa yêu cầu xóa luôn ảnh.

**Font trên Windows 10 (anh/chị báo lỗi):**
- Đã kiểm tra: Be Vietnam Pro có subset tiếng Việt cho cả 5 độ đậm (400–800); dữ liệu không có chữ dựng sẵn (NFD) gây lệch dấu.
- Đã sửa: độ đậm 900 (PR #51).
- **Chờ ảnh chụp** chỗ lỗi + tên trang + trình duyệt để xác định nếu vẫn còn.

**Việc tiếp theo:**
- [ ] Ảnh chụp lỗi font trên Windows 10 (nếu còn).
- [ ] Thử gửi báo giá kèm ảnh trên web thật → xem trong Admin.
- [ ] Đạt Danh điền `tai-lieu/San-pham-dien-ma-Dat-Danh.xlsx` → đưa mã lên web.
- [ ] Bước 4b: dòng hàng quản lý trong Admin.
- [ ] Google Search Console — để sau.

---

## Sửa giao diện theo UI review (10/11/2026) — đã duyệt, đưa lên main

**Quay lại:** mốc trước khi sửa là commit `602f1b77c381ca00015d3ac8ea4f51dfc1acc19a` trên `main` (PR #52).

1. Trang chủ điện thoại: chấm chuyển slide đè nút gọi → dời xuống dưới hàng nút.
2. Chữ xám nhạt (tương phản 2,6:1) → xám đậm hơn một bậc.
3. Nhãn “Zalo” chữ trắng trên xanh nhạt, 8–9px → xanh đậm hơn, chữ to hơn.
4. “Còn hàng” hiện ở mọi sản phẩm → đổi thành “Có sẵn / đặt hàng nhanh” (phương án c).
5. Chữ gợi ý ô tìm kiếm bị cắt trên điện thoại → rút gọn.
6. Hàng 4 cam kết ở đầu trang sản phẩm: ẩn trên điện thoại.
7. Tablet: hàng cam kết xếp 2 × 2 tới màn máy tính.
8. Thêm link “Bỏ qua tới nội dung” cho người dùng bàn phím.
9. Sửa cấu trúc số liệu hero trang chủ (đọc màn hình).
10. Chấm chuyển slide: vùng bấm 44px.
11. Trang dòng hàng: bớt lặp tên hãng.
12. Trang Sản phẩm: ảnh nhỏ cho danh sách dòng hàng (giảm dung lượng).
13. Số trang trí trang Dịch vụ: ẩn với phần mềm đọc màn hình.

**Kết quả kiểm tra sau khi sửa:** kiểm tra tự động (axe, chuẩn WCAG 2 AA) 11 trang × 2 cỡ màn hình: 56 lỗi → **0 lỗi**; chấm slide cách nút gọi 20px (trước đè 24px); Tab đầu tiên là “Bỏ qua tới nội dung”; trang Sản phẩm 1,3 MB → 0,58 MB (118 ảnh nhỏ `public/img/sp/nho/`, 3 MB → 251 KB); 601 trang + 71 trang hãng/dòng không lỗi.

### Trang sản phẩm — so với cách làm phổ biến (10/11/2026)

- **Định hướng của Đạt Danh:** web dùng để **giới thiệu sản phẩm là chính**; báo giá / liên hệ là phụ. **Không phải bán hàng trực tuyến** → không làm ô số lượng, giỏ báo giá, nút mua; khách ghi số lượng trong ô ghi chú nếu cần.
- Vì vậy ưu tiên **nội dung giới thiệu** (hình ảnh, mô tả, thông số, tài liệu, chứng từ) hơn các tính năng thúc đẩy đặt hàng; nút báo giá giữ ở mức vừa phải.
- **Đề xuất — tạm ghi lại, chưa làm (10/11/2026):**

  | # | Việc | Khách được gì | Cần gì | Trạng thái |
  |---|---|---|---|---|
  | 1 | Gợi ý **“Thường dùng kèm”** (PLC → module mở rộng, nguồn, HMI cùng hãng) | Báo giá cả bộ một lần | Dùng dòng hàng hiện có; Đạt Danh xem lại gợi ý | Làm được ngay |
  | 2 | Khối **“Cần hỗ trợ chọn mã?”** cạnh form (gửi ảnh tem nhãn / mã cũ → tìm mã tương đương, nút Zalo) | Không biết mã vẫn hỏi được | Không cần | Làm được ngay |
  | 3 | Bảng **“Các mã trong series”** + nút “Báo giá mã này” (điền sẵn mã vào form — nút liên hệ, không phải nút mua) | Chọn đúng mã ngay trên trang | File Excel mã sản phẩm | Chờ Excel |
  | 4 | **Mã đặt hàng** dưới tên + **3–5 thông số nhanh** | Kỹ sư biết ngay đúng hàng | Cột mã + thông số (mã bán chạy) | Chờ Excel |
  | 5 | Mục **“Tài liệu”** tải PDF (thêm ô tải file trong Admin) | Có catalogue / hướng dẫn | File PDF | Chờ Đạt Danh |
  | 6 | **CO, CQ / giấy ủy quyền hãng** (sản phẩm, trang hãng, Giới thiệu) — chỉ khi có thật | Tin hàng chính hãng | Xác nhận + ảnh giấy tờ | Chờ Đạt Danh |

  Thứ tự đề xuất: 1–2 trước (không chờ ai) → 3–4 khi có Excel → 5–6 khi Đạt Danh trả lời.

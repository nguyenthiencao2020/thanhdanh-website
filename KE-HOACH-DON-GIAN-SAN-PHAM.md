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

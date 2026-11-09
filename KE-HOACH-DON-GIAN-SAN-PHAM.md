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

## 6. Tiến độ

- [ ] Ẩn danh mục / hãng trống
- [ ] Trang Sản phẩm 3 bước, bỏ cột lọc trái
- [ ] Menu Sản phẩm mới trên header
- [ ] Trang chủ: Theo hãng / Theo loại
- [ ] Ô *Hãng chủ lực* trong Admin + migration `0011`
- [ ] QA máy tính / tablet / điện thoại

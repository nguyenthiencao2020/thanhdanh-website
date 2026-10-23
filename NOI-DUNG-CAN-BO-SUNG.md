# Nội dung cần bổ sung

Danh sách những nội dung trên website hiện đang là **tạm / giả định / còn thiếu**, cần thay bằng thông tin thật.
Đánh dấu `[x]` khi đã xong.

**Mức ưu tiên:** 🔴 cần làm trước khi công khai website · 🟡 nên có sớm · 🟢 bổ sung dần

**Ở đâu sửa:**
- **Admin**: tự sửa tại `/admin` (sau khi tạo tài khoản quản trị, xem README mục 3), không cần sửa code.
- **Code**: gửi nội dung cho người phát triển để cập nhật.

---

## 1. Thông tin công ty — Admin → Cài đặt

| | Ưu tiên | Nội dung | Hiện trạng | Cần bổ sung |
|---|---|---|---|---|
| [x] | 🔴 | **Tên công ty chính thức** | ✅ Đã cập nhật theo giấy chứng nhận ĐKDN: *Công ty TNHH Thương mại Vật tư Nhà máy Đạt Danh* (tiếng Anh: *Dat Danh Factory Supplies Materials Trading Company Limited*) | — |
| [x] | 🔴 | **Logo có chữ “Đạt Danh”** | ✅ Đã thay bằng `Ref/Đạt Danh_logo_2.png` (header, footer, trang Giới thiệu, admin, favicon, file báo giá Excel) | — |
| [x] | 🔴 | **Mã số thuế / Số ĐKKD** | ✅ MST 0319753015, đăng ký lần đầu 20/10/2026 — hiển thị ở chân trang | — |
| [ ] | 🔴 | **Email liên hệ** | Chưa có (đang ẩn) | Email nhận báo giá, ví dụ `sales@...` hoặc Gmail công ty |
| [ ] | 🟡 | **Giờ làm việc** | Tạm ghi *Thứ 2 – Thứ 7: 7:30 – 17:30* (giả định) | Giờ làm việc thực tế |
| [ ] | 🟡 | **Bản đồ Google Maps** | Đang tìm theo địa chỉ, có thể chưa ghim đúng vị trí | Google Maps → tìm đúng cửa hàng → *Chia sẻ → Nhúng bản đồ* → copy link trong `src="..."` |
| [ ] | 🟡 | **Số Zalo** | Đang dùng 0907 646 647 | Xác nhận số Zalo nhận tin của khách |
| [ ] | 🟡 | **Facebook / Fanpage** | Chưa có | Link fanpage (nếu có) — *cần thêm hiển thị ở chân trang trong Code* |
| [ ] | 🟡 | **Giới thiệu công ty** | Đoạn văn chung chung, tự viết | Viết lại 2–4 đoạn: năm thành lập, kinh nghiệm, kho hàng/quy mô, khách hàng phục vụ (khu công nghiệp, ngành nghề), thế mạnh, cam kết |
| [ ] | 🟢 | **Khẩu hiệu** | *Chuyên cung cấp vật tư nhà máy* (lấy từ bảng quảng cáo) | Giữ hoặc đổi |

## 2. Sản phẩm — Admin → Sản phẩm

| | Ưu tiên | Nội dung | Hiện trạng | Cần bổ sung |
|---|---|---|---|---|
| [ ] | 🔴 | **10 sản phẩm mẫu** | Tên, mô tả do mình viết để minh họa; ảnh là hình vẽ minh họa (không phải ảnh thật) | Xóa hoặc sửa thành sản phẩm thật |
| [ ] | 🔴 | **Danh sách sản phẩm thật** | Chưa có | Mỗi sản phẩm: tên, **mã hàng**, thương hiệu, danh mục, ảnh thật, mô tả ngắn (1 câu), mô tả chi tiết + **thông số kỹ thuật**, giá (để trống = “Liên hệ báo giá”) |
| [ ] | 🔴 | **Ảnh sản phẩm** | Hình minh họa SVG trong `public/demo/` | Ảnh chụp thật hoặc ảnh từ catalogue hãng (được phép sử dụng). Nên: **nền trắng, tỉ lệ 4:3, tối thiểu 800×600px**, dưới 4MB |
| [ ] | 🟡 | **Sản phẩm nổi bật** | 7 sản phẩm mẫu đang được đánh dấu | Chọn 4–8 mặt hàng bán chạy để hiện ở trang chủ |

> Mẹo: chưa cần nhập hết kho hàng. Mỗi danh mục 5–10 mã phổ biến là đủ để khách thấy năng lực;
> khách cần mã khác sẽ gửi yêu cầu báo giá.

## 3. Danh mục — Admin → Danh mục

| | Ưu tiên | Nội dung | Hiện trạng | Cần bổ sung |
|---|---|---|---|---|
| [ ] | 🟡 | **5 danh mục** | Theo bảng quảng cáo: Thiết bị điện công nghiệp · Tự động hóa · Khí nén – Thủy lực · Motor – Hộp giảm tốc · Phụ kiện đường ống – Van | Xác nhận, đổi tên hoặc thêm (ví dụ: Cảm biến, Tủ điện, Dụng cụ – Bảo hộ lao động…) |
| [ ] | 🟡 | **Mô tả danh mục** | Tự viết, liệt kê ví dụ mặt hàng | Liệt kê đúng các loại hàng công ty thực sự kinh doanh |
| [ ] | 🟢 | **Ảnh danh mục** | Hình minh họa | Ảnh thật đại diện cho mỗi nhóm hàng (tỉ lệ 4:3) |

### 3b. Cây danh mục mới (theo cấu trúc lqe.com.vn)

| | Ưu tiên | Nội dung | Hiện trạng | Cần bổ sung |
|---|---|---|---|---|
| [ ] | 🔴 | **17 nhóm, 64 danh mục con** (Admin → Danh mục) | Dựng theo cách tổ chức của LQE, chia theo loại sản phẩm; bỏ nhóm không thuộc ngành (máy lạnh, điện mặt trời, máy phát, cân điện tử, hóa chất) | Xóa danh mục công ty không kinh doanh, thêm danh mục còn thiếu. Danh mục con nên đặt theo **loại hàng**; thương hiệu đã có bộ lọc riêng |
| [ ] | 🟢 | **Ảnh nhóm danh mục** | 8/17 nhóm có hình minh họa, còn lại hiện icon | Ảnh thật cho từng nhóm (tỉ lệ 4:3) |

## 4. Thương hiệu — Admin → Thương hiệu

| | Ưu tiên | Nội dung | Hiện trạng | Cần bổ sung |
|---|---|---|---|---|
| [ ] | 🔴 | **Danh sách hãng** | 13 hãng lấy từ bảng quảng cáo | Xác nhận công ty thực sự cung cấp hàng các hãng này; thêm/bớt nếu cần |
| [ ] | 🟡 | **Logo IDEC** | Đang hiện dạng chữ (logo trong file Excel bị dính khung chọn) | Tải logo IDEC chuẩn (PNG/SVG nền trong suốt) |
| [ ] | 🟢 | **Logo ifm, Mitsubishi** | ifm hơi nhỏ; Mitsubishi bị lẹm nhẹ chữ C (đã xóa con trỏ chuột trong ảnh gốc) | Thay logo chất lượng tốt hơn |
| [ ] | 🟢 | **Giấy chứng nhận đại lý** | Chưa có | Nếu là đại lý / nhà phân phối chính thức của hãng nào → gửi giấy chứng nhận để đưa lên website (tăng uy tín) |

## 5. Nội dung trang chủ & trang Giới thiệu — Code

Các đoạn chữ sau đang viết sẵn trong code. Gửi nội dung muốn đổi để cập nhật.

| | Ưu tiên | Vị trí | Nội dung hiện tại | Cần xác nhận / bổ sung |
|---|---|---|---|---|
| [ ] | 🔴 | Trang chủ → **“Vì sao chọn chúng tôi”** | Hàng chính hãng · Báo giá nhanh · Giao hàng tận nơi · Tư vấn kỹ thuật | Các cam kết này có đúng không? Có cam kết cụ thể hơn (VD: “báo giá trong 2 giờ”, “giao trong ngày tại TP.HCM”, “bảo hành 12 tháng”)? |
| [ ] | 🔴 | Trang chủ → **ô số liệu** đầu trang | 13+ Thương hiệu · 5 Nhóm sản phẩm (tự đếm) · Miễn phí Tư vấn chọn mã | Có số liệu thật nổi bật hơn không? VD: số năm kinh nghiệm, số khách hàng/nhà máy đã phục vụ, số mã hàng tồn kho |
| [ ] | 🟡 | Trang chủ → **“Quy trình 4 bước”** | Gửi yêu cầu → Tư vấn chọn mã → Nhận báo giá → Giao hàng | Đúng quy trình thực tế? Có nhắc bảo hành — xác nhận chính sách bảo hành |
| [ ] | 🟡 | Trang chủ → **tiêu đề lớn** | “Vật tư & thiết bị cho nhà máy của bạn” | Giữ hoặc đổi |
| [ ] | 🟡 | Trang chủ, Giới thiệu → **ảnh minh họa** | Hình vẽ minh họa sản phẩm | **Ảnh thật**: mặt tiền cửa hàng, kho hàng, đội ngũ, xe giao hàng, hàng hóa đóng gói. Ảnh thật tăng uy tín hơn nhiều so với hình minh họa |

## 5b. Nội dung mẫu mới (theo cấu trúc LQE) — Admin

| | Ưu tiên | Nội dung | Hiện trạng | Cần bổ sung |
|---|---|---|---|---|
| [ ] | 🔴 | **Dịch vụ** (Admin → Dịch vụ) | 5 dịch vụ mẫu phù hợp nhà cung cấp vật tư: tư vấn chọn thiết bị, tìm mã tương đương, cung cấp theo dự án, giao hàng, hỗ trợ kỹ thuật | Xác nhận công ty có làm các dịch vụ này; thêm nếu có lắp tủ điện, lập trình PLC, sửa chữa… |
| [ ] | 🔴 | **4 trang chính sách** (Admin → Trang chính sách) | Bản nháp chung: bảo hành theo hãng, vận chuyển, đổi trả khi giao sai/lỗi NSX, bảo mật thông tin | Điền điều kiện thực tế: thời gian bảo hành, phí ship, thời hạn đổi trả |
| [ ] | 🔴 | **Ảnh banner trang chủ** (Admin → Banner trang chủ) | 3 slide đang dùng hình vẽ minh họa | 2–3 ảnh chụp thật, ngang, tối thiểu 1920×800px: mặt tiền cửa hàng, kho hàng, hàng hóa, giao hàng. Đây là thứ làm trang chủ giống LQE nhất |
| [ ] | 🟡 | **Sứ mệnh, Tầm nhìn, Giá trị cốt lõi** (Admin → Cài đặt) | Bản nháp do mình viết | Viết lại theo định hướng của công ty |
| [ ] | 🟡 | **3 bài tin tức mẫu** (Admin → Tin tức) | Kiến thức kỹ thuật chung: chọn aptomat, cảm biến tiệm cận, xi lanh khí nén | Giữ, sửa hoặc thay bằng bài của công ty; nên đăng đều 2–4 bài/tháng cho SEO |
| [ ] | 🟡 | **Câu chữ cam kết** | “Tư vấn miễn phí, không ràng buộc” (trang Dịch vụ), “Bảo hành theo hãng” (chi tiết sản phẩm) | Xác nhận đúng chính sách công ty |
| [ ] | 🟢 | **Thanh thông báo** (Admin → Cài đặt) | “Báo giá nhanh vật tư nhà máy — gọi hotline…” | Đổi nội dung khuyến mãi / thông báo, hoặc để trống để ẩn |
| [ ] | 🟢 | **Link Messenger** (Admin → Cài đặt) | Chưa có → nút Messenger đang ẩn | Link dạng `https://m.me/ten-fanpage` |
| [ ] | 🟢 | **Thông số kỹ thuật, datasheet, ảnh phụ** cho từng sản phẩm | Chỉ sản phẩm PLC mẫu có bảng thông số | Nhập khi thêm sản phẩm thật |

## 6. Trang / chức năng nên có thêm

| | Ưu tiên | Nội dung | Ghi chú |
|---|---|---|---|
| [ ] | 🔴 | **Thông báo khi có yêu cầu báo giá** | Hiện yêu cầu chỉ lưu trong Supabase (bảng `inquiries`) và trang Admin, **không ai được báo**. Cần chọn kênh nhận: email / Zalo / Telegram → báo người phát triển cài đặt |
| [ ] | 🟡 | **Chính sách bảo mật thông tin** | Form báo giá thu thập họ tên, SĐT, email → nên có trang chính sách xử lý dữ liệu cá nhân |
| [ ] | 🟡 | **Chính sách bảo hành, đổi trả, giao hàng, thanh toán** | Cung cấp nội dung từng chính sách |
| [ ] | 🟢 | **Khách hàng / dự án tiêu biểu** | Logo hoặc tên các nhà máy, công ty đã cung cấp (cần sự đồng ý của khách) |
| [ ] | 🟢 | **Tin tức / kiến thức kỹ thuật** | Bài viết hướng dẫn chọn thiết bị, tra mã thay thế… giúp khách tìm thấy website trên Google |
| [ ] | 🟢 | **Catalogue / bảng giá PDF** | File tải về cho khách |

## 7. Tên miền & quảng bá

| | Ưu tiên | Nội dung | Ghi chú |
|---|---|---|---|
| [ ] | 🔴 | **Tên miền riêng** | Hiện dùng `thanhdanh-website.vercel.app`. Mua tên miền (VD `.vn` / `.com.vn`) → gắn trong Vercel → sửa biến `NEXT_PUBLIC_SITE_URL` |
| [ ] | 🟡 | **Google Business Profile** | Đăng ký doanh nghiệp trên Google Maps để khách tìm thấy cửa hàng |
| [ ] | 🟡 | **Google Search Console** | Khai báo website + gửi sitemap (`/sitemap.xml`) để Google lập chỉ mục |
| [ ] | 🟢 | **Biểu tượng tab trình duyệt (favicon)** | Đang tạm là chữ “TD” trên nền xanh. Có thể làm từ logo |
| [ ] | 🟢 | **Ảnh chia sẻ Facebook/Zalo** | Khi gửi link website, ảnh xem trước đang là logo. Có thể làm ảnh banner riêng (1200×630px) |

---

## Cách gửi nội dung

- **Thông tin chữ**: điền thẳng vào file này (cột “Cần bổ sung”) hoặc gửi file Word/Excel.
- **Ảnh**: đặt tên file theo mã hàng (VD `6ES7214-1AG40-0XB0.jpg`), gom theo danh mục.
- **Danh sách sản phẩm nhiều**: dùng Excel với các cột: *Tên · Mã hàng · Thương hiệu · Danh mục · Mô tả ngắn · Thông số · Giá · Tên file ảnh* — có thể nhập hàng loạt vào Supabase thay vì nhập tay từng sản phẩm.

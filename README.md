# Website Đạt Danh – Vật tư nhà máy

Công ty TNHH Thương mại Vật tư Nhà máy Đạt Danh (MST 0319753015).

```
GitHub (source code)  →  Vercel (build/host/CDN)  →  Supabase (Postgres + Storage + Auth = CMS)
```

- **Next.js 15** (App Router, Server Components, Server Actions) + **Tailwind CSS 4**
- **Supabase**: dữ liệu sản phẩm, danh mục, thương hiệu, thông tin công ty, yêu cầu báo giá; ảnh lưu ở Storage; đăng nhập quản trị bằng Auth
- **Vercel**: build và host; mỗi lần push lên GitHub sẽ tự deploy

## Cấu trúc trang

Chi tiết từng section: **[SITE-AUDIT.md](SITE-AUDIT.md)** (theo mẫu cấu trúc của lqe.com.vn).

| Đường dẫn | Nội dung |
|---|---|
| `/` | Trang chủ |
| `/gioi-thieu` | Giới thiệu, sứ mệnh, tầm nhìn, giá trị cốt lõi |
| `/san-pham`, `/danh-muc-san-pham/[slug]` | Danh sách sản phẩm: lọc thương hiệu, tìm kiếm, sắp xếp, phân trang |
| `/san-pham/[slug]` | Chi tiết sản phẩm: gallery, thông số, datasheet, form báo giá |
| `/thuong-hieu`, `/dich-vu`, `/lien-he` | Thương hiệu, dịch vụ, liên hệ – báo giá |
| `/tin-tuc`, `/tin-tuc/[slug]` | Tin tức / kiến thức kỹ thuật |
| `/chinh-sach-...` | Trang chính sách (bảo hành, vận chuyển, đổi trả, bảo mật) |
| `/tim-kiem` | Tìm kiếm sản phẩm + bài viết |
| `/admin` | Trang quản trị (CMS) – cần đăng nhập |

Trang công khai được cache (ISR, 60 giây) và tự làm mới ngay khi sửa nội dung trong `/admin`.

## Triển khai lần đầu

### 1. Supabase
1. Tạo project tại [supabase.com](https://supabase.com) (region gần nhất: Singapore).
   Dùng tài khoản nào cũng được, không cần trùng tài khoản GitHub.
2. **SQL Editor** → chạy lần lượt:
   - `supabase/migrations/0001_init.sql` (bảng, phân quyền RLS, bucket ảnh `media`) — chỉ chạy một lần khi cài mới
   - `supabase/migrations/0002_demo_images.sql` (cột ảnh danh mục + gắn ảnh minh họa cho dữ liệu mẫu)
   - `supabase/seed.sql` (dữ liệu ban đầu: thông tin công ty, danh mục, thương hiệu, sản phẩm mẫu)
   - `supabase/migrations/0003_security_fixes.sql` (sửa cảnh báo của Security Advisor)
   - `supabase/migrations/0004_dat_danh.sql` (đổi tên công ty theo giấy phép, thêm MST / tên tiếng Anh)
   - `supabase/migrations/0005_site_structure.sql` (tin tức, dịch vụ, trang chính sách, gallery/thông số sản phẩm)
   - `supabase/migrations/0006_banners.sql` (slider banner trang chủ)
   - `supabase/migrations/0007_category_tree.sql` (danh mục 2 cấp: 17 nhóm, 64 danh mục con)
   - `supabase/migrations/0008_hinh-anh-thuc-te.sql` (113 sản phẩm có ảnh thật, 62 thương hiệu, ảnh danh mục, slider)
   - `supabase/migrations/0009_sua-chu-hoa-mo-ta.sql` (sửa chữ “PLC”, “CB” trong mô tả)
   - `supabase/migrations/0010_tim-kiem-khong-dau.sql` (tìm kiếm có dấu/không dấu; bỏ “nổi bật” cho sản phẩm còn ảnh vẽ)

   > Cài mới: chạy `0001` → … → `0010` theo thứ tự, rồi `seed.sql`.
   > Trang thật đã chạy `0008` (đã kiểm tra: 62 thương hiệu / 123 sản phẩm) và `0010`. Chạy `0009` nếu chưa chạy.
   > `seed.sql` không bao giờ dừng giữa chừng: bảng/cột nào chưa có sẽ được bỏ qua kèm thông báo
   > *“Bỏ qua dữ liệu mẫu … hãy chạy 000x_… trước”* — chạy file đó rồi chạy lại `seed.sql`.
   > Đã chạy `0001` và `seed.sql` từ trước? Chạy thêm các file migration còn thiếu, **rồi chạy lại `seed.sql`**
   > để có bài viết, dịch vụ, chính sách mẫu (dữ liệu đã có được giữ nguyên).
   > Các file migration đều chạy lại nhiều lần được, không gây lỗi.
3. **Authentication → Sign In / Providers → Email**: tắt *Allow new users to sign up* (không cho người lạ tự tạo tài khoản).
4. Copy 2 giá trị để dán vào Vercel (hoặc bấm nút **Connect** ở thanh trên cùng):
   - **Project Settings → Data API**: `Project URL`
   - **Project Settings → API Keys**: *Publishable key* (hoặc tab *Legacy API Keys* → `anon public`).
     Không dùng *secret* / *service_role* key.

### 2. Vercel
1. [vercel.com](https://vercel.com) → *Add New Project* → import repo GitHub này.
2. Thêm Environment Variables:
   | Tên | Giá trị |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key (hoặc anon public key) |
   | `NEXT_PUBLIC_SITE_URL` | Domain chính thức: `https://www.thietbinhamay-dd.com` |
   | `CRON_SECRET` | Chuỗi ngẫu nhiên (bảo vệ cron giữ Supabase hoạt động, xem mục 4) |
3. Deploy. Gắn tên miền riêng tại *Settings → Domains* (đã gắn `www.thietbinhamay-dd.com`).
   Chưa đặt `NEXT_PUBLIC_SITE_URL` thì ảnh chia sẻ / sitemap tạm dùng tên miền production của Vercel.
4. Thêm hoặc sửa biến môi trường sau khi đã deploy (*Settings → Environment Variables*) thì phải
   **Redeploy** (*Deployments → ⋯ → Redeploy*) để có hiệu lực.

> Chưa có biến môi trường Supabase, website vẫn build và hiển thị bằng dữ liệu mặc định trong
> `src/data/catalog.json` (form báo giá và `/admin` sẽ báo “chưa cấu hình”).

### 3. Tài khoản quản trị (làm sau, khi cần dùng `/admin`)
Website và form báo giá chạy được mà không cần bước này. Chỉ cần tạo khi muốn đăng nhập `/admin`
để sửa nội dung hoặc xem yêu cầu báo giá (trước đó có thể xem trong Supabase → *Table Editor → inquiries*).

1. **Authentication → Users → Add user → Create new user**: nhập email + mật khẩu, tích *Auto Confirm User*.
2. Cấp quyền quản trị (SQL Editor), kết quả phải là `1 row`:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'email-quan-tri@example.com'
   on conflict (user_id) do nothing;
   ```
3. Đăng nhập tại `https://www.thietbinhamay-dd.com/admin`. Nếu không vào được, ô đỏ trên trang đăng nhập ghi rõ lý do
   (sai mật khẩu / email chưa xác nhận / chưa cấp quyền / trình duyệt chặn cookie).
4. Kiểm tra ai đang có quyền: `select u.email from public.admins a join auth.users u on u.id = a.user_id;`

**Hướng dẫn có ảnh minh họa:** `https://www.thietbinhamay-dd.com/huong-dan-quan-tri.html`
(link ẩn, không hiện trên menu, Google không lập chỉ mục; trong admin có link “Hướng dẫn sử dụng ↗”).
File gốc: `public/huong-dan-quan-tri.html` — gửi qua Zalo/email được, mở bằng trình duyệt.

### 4. Giữ Supabase không bị tạm dừng (gói miễn phí)
Supabase gói Free tự **pause** project nếu 7 ngày không có hoạt động. Website đã có sẵn cron:
`vercel.json` cho Vercel gọi `/api/keep-alive` **mỗi ngày lúc 01:00 UTC (08:00 giờ VN)**, route này đọc 1 dòng từ Supabase.

- Không cần cấu hình thêm: cron tự bật sau khi deploy (xem tại Vercel → *Settings → Cron Jobs*).
- Nên thêm biến môi trường `CRON_SECRET` (chuỗi ngẫu nhiên dài) trên Vercel rồi Redeploy, để người ngoài không gọi được route này.
- Kiểm tra: Vercel → *Settings → Cron Jobs* → **Run** → xem *Logs*, kết quả `{"ok":true,...}` là được.

## File báo giá Excel

`tai-lieu/Bao-gia-Dat-Danh.xlsx` — mẫu báo giá (sheet *Báo giá*, *Bảng giá*, *Danh mục*, *Hướng dẫn*):
nhập Mã hàng → tự điền tên, hãng, ĐVT, đơn giá từ Bảng giá; tự tính thành tiền, chiết khấu, VAT, tổng cộng.
Danh mục và thương hiệu giống website. Tạo lại sau khi đổi danh mục: `python3 scripts/build-bao-gia.py`.

## Chạy trên máy

```bash
cp .env.example .env.local   # điền thông tin Supabase
npm install
npm run dev                  # http://localhost:3000
```

Lệnh khác: `npm run build`, `npm run typecheck`, `npm run seed:sql` (tạo lại `supabase/seed.sql` từ `src/data/catalog.json`).

## Quản trị nội dung (`/admin`)

- **Yêu cầu báo giá**: xem khách gửi form, đánh dấu đã xử lý
- **Sản phẩm**: thêm/sửa/xóa, ảnh chính + ảnh phụ, thông số kỹ thuật, datasheet PDF, tình trạng hàng, nổi bật
- **Danh mục / Thương hiệu**: thêm/sửa/xóa, tải logo
- **Banner trang chủ**: slider đầu trang — tải ảnh, tiêu đề, nút, thứ tự
- **Tin tức**: viết bài, ảnh đại diện, danh mục tin, thẻ, bài nổi bật
- **Dịch vụ / Trang chính sách**: thêm/sửa/xóa nội dung
- **Cài đặt**: tên công ty, MST, hotline, Zalo, Messenger, email, địa chỉ, giờ làm việc, bản đồ, giới thiệu, sứ mệnh, tầm nhìn, giá trị cốt lõi, thanh thông báo

## Ảnh lưu ở đâu

| Loại | Nơi lưu | Ghi chú |
|---|---|---|
| Ảnh sản phẩm có sẵn | `public/img/sp/` (118 ảnh, 600×600) | Từ file “Hình ảnh đưa web.xlsx” |
| Logo thương hiệu | `public/img/th/` | 60 logo, đã thu về cỡ hiển thị |
| Ảnh danh mục | `public/img/dm/` (640×480) + `public/img/dm/nho/` (160×120 cho menu) | 43 nhóm/danh mục con |
| Slider, Giới thiệu, nền hero | `public/img/banner/` | Nền hero: `hero-nha-may.jpg` (+ bản 900px cho điện thoại) |
| Logo công ty | `public/logo-dat-danh-ngang-3.png` (header), `public/logo-dat-danh-emblem-3.png` (footer, Giới thiệu, admin, Excel) | Gốc trong `Ref/Logo_Dat Danh _final*_3.png` |
| Ảnh tải lên trong Admin | Supabase Storage → bucket `media` | Thay ảnh có sẵn của sản phẩm đó |

Database chỉ lưu **đường dẫn** ảnh (`image_url`, `logo_url`).

## Kế hoạch đang làm

- **[KE-HOACH-DON-GIAN-SAN-PHAM.md](KE-HOACH-DON-GIAN-SAN-PHAM.md)** — trang Sản phẩm đơn giản, tập trung vào hãng; có mốc commit và cách quay lại bản cũ.

## Nội dung cần bổ sung

Website đang dùng một số nội dung tạm (sản phẩm mẫu, ảnh minh họa, cam kết dịch vụ…).
Danh sách chi tiết những gì cần thay bằng thông tin thật: **[NOI-DUNG-CAN-BO-SUNG.md](NOI-DUNG-CAN-BO-SUNG.md)**.

## Thư mục

```
src/app/(site)/      Trang công khai
src/app/admin/       Trang quản trị + server actions
src/components/      Giao diện dùng chung
src/lib/data.ts      Truy vấn dữ liệu (Supabase hoặc dữ liệu mặc định)
src/data/catalog.json Dữ liệu ban đầu
supabase/            Schema SQL + seed
public/              Logo công ty, ảnh sản phẩm/thương hiệu/danh mục (public/img), ảnh vẽ cũ (public/demo), hướng dẫn quản trị
tai-lieu/            File Excel báo giá
Ref/                 Tài liệu tham khảo gốc
```

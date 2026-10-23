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

   > Cài mới: chạy `0001` → `0002` → `0003` → `0004` → `0005` → `0006` → `seed.sql`.
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
   | `NEXT_PUBLIC_SITE_URL` | Domain chính thức, ví dụ `https://thanhdanh.vn` |
3. Deploy. Gắn tên miền riêng tại *Settings → Domains*.
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
   select id from auth.users where email = 'email-quan-tri@example.com';
   ```
3. Đăng nhập tại `https://<domain>/admin`.

### 4. Giữ Supabase không bị tạm dừng (gói miễn phí)
Supabase gói Free tự **pause** project nếu 7 ngày không có hoạt động. Website đã có sẵn cron:
`vercel.json` cho Vercel gọi `/api/keep-alive` **mỗi ngày lúc 01:00 UTC (08:00 giờ VN)**, route này đọc 1 dòng từ Supabase.

- Không cần cấu hình thêm: cron tự bật sau khi deploy (xem tại Vercel → *Settings → Cron Jobs*).
- Nên thêm biến môi trường `CRON_SECRET` (chuỗi ngẫu nhiên dài) trên Vercel rồi Redeploy, để người ngoài không gọi được route này.
- Kiểm tra: Vercel → *Settings → Cron Jobs* → **Run** → xem *Logs*, kết quả `{"ok":true,...}` là được.

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
public/              Logo công ty, logo thương hiệu, ảnh minh họa (public/demo)
Ref/                 Tài liệu tham khảo gốc
```

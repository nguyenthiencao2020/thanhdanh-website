# Website Thành Danh – Vật tư nhà máy

```
GitHub (source code)  →  Vercel (build/host/CDN)  →  Supabase (Postgres + Storage + Auth = CMS)
```

- **Next.js 15** (App Router, Server Components, Server Actions) + **Tailwind CSS 4**
- **Supabase**: dữ liệu sản phẩm, danh mục, thương hiệu, thông tin công ty, yêu cầu báo giá; ảnh lưu ở Storage; đăng nhập quản trị bằng Auth
- **Vercel**: build và host; mỗi lần push lên GitHub sẽ tự deploy

## Cấu trúc trang

| Đường dẫn | Nội dung |
|---|---|
| `/` | Trang chủ: banner, danh mục, sản phẩm nổi bật, thương hiệu |
| `/san-pham` | Danh sách sản phẩm, lọc theo `?danh-muc=`, `?thuong-hieu=`, tìm kiếm `?q=` |
| `/san-pham/[slug]` | Chi tiết sản phẩm + form yêu cầu báo giá |
| `/thuong-hieu`, `/gioi-thieu`, `/lien-he` | Thương hiệu, giới thiệu, liên hệ/báo giá |
| `/admin` | Trang quản trị (CMS) – cần đăng nhập |

Trang công khai được cache (ISR, 60 giây) và tự làm mới ngay khi sửa nội dung trong `/admin`.

## Triển khai lần đầu

### 1. Supabase
1. Tạo project tại [supabase.com](https://supabase.com) (region gần nhất: Singapore).
   Dùng tài khoản nào cũng được, không cần trùng tài khoản GitHub.
2. **SQL Editor** → chạy lần lượt:
   - `supabase/migrations/0001_init.sql` (bảng, phân quyền RLS, bucket ảnh `media`) — chỉ chạy một lần
   - `supabase/seed.sql` (dữ liệu ban đầu: thông tin công ty, danh mục, thương hiệu, sản phẩm mẫu)
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

## Chạy trên máy

```bash
cp .env.example .env.local   # điền thông tin Supabase
npm install
npm run dev                  # http://localhost:3000
```

Lệnh khác: `npm run build`, `npm run typecheck`, `npm run seed:sql` (tạo lại `supabase/seed.sql` từ `src/data/catalog.json`).

## Quản trị nội dung (`/admin`)

- **Yêu cầu báo giá**: xem khách gửi form, đánh dấu đã xử lý
- **Sản phẩm**: thêm/sửa/xóa, tải ảnh, ẩn/hiện, đánh dấu nổi bật
- **Danh mục / Thương hiệu**: thêm/sửa/xóa, tải logo
- **Cài đặt**: tên công ty, hotline, Zalo, email, địa chỉ, giờ làm việc, bản đồ, giới thiệu

## Cần xác nhận trước khi chạy chính thức

- **Tên công ty**: logo ghi “TM DV Thiết bị Nhà máy **Thành Danh**”, còn giấy tờ (`Ref/info.jpg`, bảng quảng cáo) ghi
  “Thương mại Vật tư Nhà máy **Đạt Danh**”. Website đang dùng tên trên logo; sửa trong *Cài đặt*.
- **Email** liên hệ chưa có.
- **10 sản phẩm mẫu** chỉ để minh họa bố cục; hãy thay bằng sản phẩm thật và ảnh thật.
- Logo **IDEC** trong file Excel bị dính khung chọn nên đang hiển thị dạng chữ; tải logo chuẩn trong *Thương hiệu*.

## Thư mục

```
src/app/(site)/      Trang công khai
src/app/admin/       Trang quản trị + server actions
src/components/      Giao diện dùng chung
src/lib/data.ts      Truy vấn dữ liệu (Supabase hoặc dữ liệu mặc định)
src/data/catalog.json Dữ liệu ban đầu
supabase/            Schema SQL + seed
public/              Logo công ty, logo thương hiệu
Ref/                 Tài liệu tham khảo gốc
```

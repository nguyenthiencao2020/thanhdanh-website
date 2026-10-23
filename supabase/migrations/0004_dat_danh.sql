-- Company renamed to the registered name (business registration certificate, MST 0319753015)
-- and legal details shown in the site footer. Safe to run more than once.

alter table public.settings add column if not exists english_name text;
alter table public.settings add column if not exists tax_code text;
alter table public.settings add column if not exists license_info text;

update public.settings set
  company_name = 'Công ty TNHH Thương mại Vật tư Nhà máy Đạt Danh',
  short_name   = 'Đạt Danh',
  english_name = 'Dat Danh Factory Supplies Materials Trading Company Limited',
  tax_code     = '0319753015',
  license_info = 'Đăng ký lần đầu ngày 20/10/2026 tại Phòng Đăng ký kinh doanh – Sở Tài chính TP. Hồ Chí Minh',
  about        = replace(about, 'Thành Danh', 'Đạt Danh'),
  updated_at   = now()
where id = 1;

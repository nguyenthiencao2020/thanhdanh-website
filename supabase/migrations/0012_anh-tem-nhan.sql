-- 0012 — Ảnh tem nhãn trong yêu cầu báo giá
-- Khách gửi tối đa 3 ảnh kèm yêu cầu báo giá. Ảnh lưu ở bucket RIÊNG TƯ `yeu-cau`:
-- ai cũng tải lên được (chỉ vào thư mục inbox/, chỉ ảnh, tối đa 3 MB), chỉ admin xem / xóa được.
-- Chạy được nhiều lần.

alter table public.inquiries add column if not exists attachments text[] not null default '{}';

alter table public.inquiries drop constraint if exists inquiries_attachments_check;
alter table public.inquiries add constraint inquiries_attachments_check check (cardinality(attachments) <= 3);

-- Khách chỉ được ghi đường dẫn ảnh trong inbox/ (không trỏ sang file khác)
drop policy if exists "inquiries public insert" on public.inquiries;
create policy "inquiries public insert" on public.inquiries for insert
  with check (
    handled = false
    and not exists (
      select 1 from unnest(attachments) a
      where a !~ '^inbox/[0-9]{4}-[0-9]{2}/[0-9a-f-]{36}\.(jpg|png|webp)$'
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('yeu-cau', 'yeu-cau', false, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "yeu-cau public insert" on storage.objects;
create policy "yeu-cau public insert" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'yeu-cau' and (storage.foldername(name))[1] = 'inbox');

drop policy if exists "yeu-cau admin read" on storage.objects;
create policy "yeu-cau admin read" on storage.objects for select
  using (bucket_id = 'yeu-cau' and public.is_admin());

drop policy if exists "yeu-cau admin delete" on storage.objects;
create policy "yeu-cau admin delete" on storage.objects for delete
  using (bucket_id = 'yeu-cau' and public.is_admin());

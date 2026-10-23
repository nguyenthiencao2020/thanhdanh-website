-- Two-level product categories (group → sub-category), modelled on the lqe.com.vn menu.
-- Safe to run more than once. Afterwards run supabase/seed.sql again: it adds the new
-- groups/sub-categories, links them to their parent and moves the 10 sample products.

alter table public.categories add column if not exists parent_id uuid references public.categories (id) on delete set null;
create index if not exists categories_parent_idx on public.categories (parent_id);


-- The old flat group "Tự động hóa" becomes the new group "Thiết bị tự động hóa (PLC)"
-- (only if it still has the original name/description, so admin edits are kept).
update public.categories
set name = 'Thiết bị tự động hóa (PLC)',
    description = 'PLC, Màn hình HMI, Servo – Bộ điều khiển chuyển động, Module mở rộng – Truyền thông.'
where slug = 'tu-dong-hoa' and name = 'Tự động hóa';

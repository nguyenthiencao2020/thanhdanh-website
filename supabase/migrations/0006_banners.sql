-- Home page hero slider (Admin → Banner trang chủ). Safe to run more than once.
-- Afterwards run supabase/seed.sql again to add the 3 default slides.

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  collage text[] not null default '{}',
  cta_label text,
  cta_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index if not exists banners_title_key on public.banners (title);

alter table public.banners enable row level security;
drop policy if exists "banners public read" on public.banners;
drop policy if exists "banners admin write" on public.banners;
create policy "banners public read" on public.banners for select using (published or public.is_admin());
create policy "banners admin write" on public.banners for all using (public.is_admin()) with check (public.is_admin());

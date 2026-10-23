-- Đạt Danh website — initial schema
-- Run in Supabase SQL Editor (or `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Admins: users allowed to edit content through /admin
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Site settings (single row, id = 1)
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  company_name text not null,
  short_name text not null,
  tagline text,
  about text,
  phone text,
  phone2 text,
  email text,
  address text,
  zalo text,
  facebook text,
  map_embed_url text,
  business_hours text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  logo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sku text,
  category_id uuid references public.categories (id) on delete set null,
  brand_id uuid references public.brands (id) on delete set null,
  summary text,
  description text,
  image_url text,
  price text,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_brand_idx on public.products (brand_id);

-- ---------------------------------------------------------------------------
-- Contact / quote requests
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (char_length(phone) between 6 and 30),
  email text check (email is null or char_length(email) <= 200),
  company text check (company is null or char_length(company) <= 200),
  message text check (message is null or char_length(message) <= 4000),
  product_id uuid references public.products (id) on delete set null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.settings enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.inquiries enable row level security;

-- admins: a user can only see their own row (is_admin() relies on this); the list is managed in the SQL Editor
create policy "admins self read" on public.admins for select using (user_id = auth.uid());

-- public read
create policy "settings public read" on public.settings for select using (true);
create policy "categories public read" on public.categories for select using (true);
create policy "brands public read" on public.brands for select using (true);
create policy "products public read" on public.products for select using (published or public.is_admin());

-- admin write
create policy "settings admin write" on public.settings for all using (public.is_admin()) with check (public.is_admin());
create policy "categories admin write" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "brands admin write" on public.brands for all using (public.is_admin()) with check (public.is_admin());
create policy "products admin write" on public.products for all using (public.is_admin()) with check (public.is_admin());

-- inquiries: anyone can submit (not mark as handled), only admins read/update/delete
create policy "inquiries public insert" on public.inquiries for insert with check (handled = false);
create policy "inquiries admin read" on public.inquiries for select using (public.is_admin());
create policy "inquiries admin update" on public.inquiries for update using (public.is_admin()) with check (public.is_admin());
create policy "inquiries admin delete" on public.inquiries for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage bucket for uploaded images
-- (public bucket: files are readable by URL; no SELECT policy so nobody can list the bucket)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media admin insert" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

-- Site structure: news/blog, services, policy pages, richer product detail, extra settings.
-- Safe to run more than once. Afterwards run supabase/seed.sql again to add the sample content
-- (existing rows are kept; empty settings fields are filled in).

-- Settings ------------------------------------------------------------------------------
alter table public.settings add column if not exists announcement text;
alter table public.settings add column if not exists announcement_url text;
alter table public.settings add column if not exists messenger_url text;
alter table public.settings add column if not exists mission text;
alter table public.settings add column if not exists vision text;
alter table public.settings add column if not exists core_values text;

-- Products: specs table, datasheet, stock, gallery ----------------------------------------
alter table public.products add column if not exists specs text;
alter table public.products add column if not exists datasheet_url text;
alter table public.products add column if not exists in_stock boolean not null default true;
alter table public.products add column if not exists gallery text[] not null default '{}';

-- News / blog --------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover_url text,
  category text,
  tags text[] not null default '{}',
  author text,
  featured boolean not null default false,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_published_at_idx on public.posts (published_at desc);

-- Services -----------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  content text,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Static pages (policies) ----------------------------------------------------------------
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- RLS ----------------------------------------------------------------------------------
alter table public.posts enable row level security;
alter table public.services enable row level security;
alter table public.pages enable row level security;

drop policy if exists "posts public read" on public.posts;
drop policy if exists "posts admin write" on public.posts;
drop policy if exists "services public read" on public.services;
drop policy if exists "services admin write" on public.services;
drop policy if exists "pages public read" on public.pages;
drop policy if exists "pages admin write" on public.pages;

create policy "posts public read" on public.posts for select using (published or public.is_admin());
create policy "posts admin write" on public.posts for all using (public.is_admin()) with check (public.is_admin());
create policy "services public read" on public.services for select using (true);
create policy "services admin write" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "pages public read" on public.pages for select using (true);
create policy "pages admin write" on public.pages for all using (public.is_admin()) with check (public.is_admin());

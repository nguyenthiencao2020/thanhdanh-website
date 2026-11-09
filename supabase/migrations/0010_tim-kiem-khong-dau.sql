-- 0010: search products with or without Vietnamese accents ("bien tan" finds "Biến tần"),
-- and stop featuring the sample products that still use a drawn placeholder image.
-- Safe to run more than once.

create schema if not exists extensions;
create extension if not exists unaccent with schema extensions;

-- unaccent() is not IMMUTABLE, so a generated column needs this wrapper (fixed dictionary, fixed search_path).
create or replace function public.f_unaccent(text)
returns text
language sql
immutable
parallel safe
strict
set search_path = ''
as $$ select extensions.unaccent('extensions.unaccent'::regdictionary, $1) $$;

alter table public.products
  add column if not exists search_text text
  generated always as (lower(public.f_unaccent(coalesce(name, '') || ' ' || coalesce(sku, '') || ' ' || coalesce(summary, '')))) stored;

-- Sample products with a drawn picture (/demo/…) no longer push real photos off "Nổi bật".
update public.products set featured = false where featured and image_url like '/demo/%';

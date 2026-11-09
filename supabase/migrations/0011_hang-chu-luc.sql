-- 0011: "Hãng chủ lực" — brands shown first on the product pages and in the Sản phẩm menu.
-- Ticked in Admin → Thương hiệu. Safe to run more than once; only sets the defaults when no brand is ticked yet.
alter table public.brands add column if not exists featured boolean not null default false;

update public.brands set featured = true
where slug in ('siemens', 'schneider-electric', 'abb', 'ifm', 'autonics', 'chint', 'weidmuller', 'sick')
  and not exists (select 1 from public.brands where featured);

-- Category images + demo illustrations for the sample catalog.
-- Safe to run more than once; only fills images that are still empty.

alter table public.categories add column if not exists image_url text;

update public.categories c set image_url = v.url
from (values
  ('thiet-bi-dien-cong-nghiep', '/demo/aptomat.svg'),
  ('tu-dong-hoa',               '/demo/plc.svg'),
  ('khi-nen-thuy-luc',          '/demo/xi-lanh-khi-nen.svg'),
  ('motor-hop-giam-toc',        '/demo/motor-giam-toc.svg'),
  ('phu-kien-duong-ong-van',    '/demo/van-bi-inox.svg')
) as v(slug, url)
where c.slug = v.slug and c.image_url is null;

update public.products p set image_url = v.url
from (values
  ('plc-siemens-s7-1200',         '/demo/plc.svg'),
  ('bien-tan-mitsubishi-fr-e800', '/demo/bien-tan.svg'),
  ('cam-bien-tiem-can-omron',     '/demo/cam-bien-tiem-can.svg'),
  ('aptomat-schneider-easy9',     '/demo/aptomat.svg'),
  ('contactor-abb-af',            '/demo/contactor.svg'),
  ('xi-lanh-khi-nen-festo',       '/demo/xi-lanh-khi-nen.svg'),
  ('van-dien-tu-smc',             '/demo/van-dien-tu.svg'),
  ('cam-bien-quang-sick',         '/demo/cam-bien-quang.svg'),
  ('motor-giam-toc',              '/demo/motor-giam-toc.svg'),
  ('van-bi-inox',                 '/demo/van-bi-inox.svg')
) as v(slug, url)
where p.slug = v.slug and p.image_url is null;

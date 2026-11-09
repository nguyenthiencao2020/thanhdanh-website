import Form from "next/form";
import Link from "next/link";
import { countByBrand, countByCategory, featuredBrands, groupIndex, nonEmptyTree, type ProductPair } from "@/lib/catalog";
import { buildCategoryTree, getBrands, getCategories, getProductPairs, getProductsPage, getSettings, PRODUCT_SORTS, type ProductSort } from "@/lib/data";
import type { Brand, Category, CategoryNode } from "@/lib/types";
import { categoryThumb } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";
import { CatalogNavProvider, CatalogResults, NavLink } from "./CatalogNav";
import { CtaBanner } from "./CtaBanner";
import { Icon } from "./Icon";
import { ProductHero } from "./ProductHero";
import { Pagination } from "./Pagination";
import { ProductCard } from "./ProductCard";

const PAGE_SIZE = 12;
const SEARCH_EXAMPLES = ["S7-1200", "LC1D", "V20", "cảm biến tiệm cận"];

export type ListingParams = { brand?: string; q?: string; sort?: string; page?: number };

const chip = (active: boolean) =>
  `inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
    active ? "border-steel-700 bg-steel-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-steel-500"
  }`;
const countBadge = (active: boolean) => `rounded-full px-1.5 text-xs font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`;

/**
 * Product catalogue for /san-pham and /danh-muc-san-pham/[slug], built so a visitor makes one choice at a time:
 * 1. nothing chosen → big search, featured brands, product types (only those with products);
 * 2. a brand or a type chosen → one row of chips with what exists inside it, with counts;
 * 3. the products.
 */
export async function ProductListing({ categorySlug, params }: { categorySlug?: string; params: ListingParams }) {
  const sort: ProductSort = params.sort && params.sort in PRODUCT_SORTS ? (params.sort as ProductSort) : "noi-bat";
  const page = Math.max(1, params.page ?? 1);

  const [categories, brands, settings, pairs, { items, total }] = await Promise.all([
    getCategories(),
    getBrands(),
    getSettings(),
    getProductPairs(),
    getProductsPage({ category: categorySlug, brand: params.brand, q: params.q, sort, page, pageSize: PAGE_SIZE }),
  ]);

  const tree = buildCategoryTree(categories);
  const groupOf = groupIndex(tree);
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));
  const category = categorySlug ? catBySlug.get(categorySlug) : undefined;
  const group = category ? tree.find((g) => g.slug === groupOf.get(category.slug)) : undefined;
  const brand = brands.find((b) => b.slug === params.brand);
  const isLanding = !category && !brand && !params.q;

  const basePath = category ? `/danh-muc-san-pham/${category.slug}` : "/san-pham";
  /** Link to a listing keeping search/sort, with the brand changed (always page 1). */
  const href = (path: string, brandSlug: string | undefined = params.brand) => {
    const sp = new URLSearchParams();
    if (brandSlug) sp.set("thuong-hieu", brandSlug);
    if (params.q && path === basePath) sp.set("q", params.q);
    if (sort !== "noi-bat") sp.set("sap-xep", sort);
    const s = sp.toString();
    return s ? `${path}?${s}` : path;
  };

  // Headline: white lead + accented tail, e.g. "Sản phẩm | Siemens", "Contactor | Schneider Electric".
  const heading = category
    ? brand
      ? { lead: category.name, accent: brand.name }
      : { lead: undefined, accent: category.name }
    : brand
      ? { lead: "Sản phẩm", accent: brand.name }
      : params.q
        ? { lead: "Kết quả cho", accent: `“${params.q}”` }
        : { lead: "Sản phẩm", accent: "chính hãng" };

  return (
    <>
      <ProductHero
        lead={heading.lead}
        accent={heading.accent}
        description={
          isLanding
            ? "Thiết bị điện công nghiệp, tự động hóa, cảm biến, nguồn và phụ kiện tủ điện từ các hãng hàng đầu — tìm theo mã hàng hoặc chọn hãng, loại hàng."
            : category?.description ?? (group && group.slug !== category?.slug ? `Thuộc nhóm ${group.name}.` : brand ? `Thiết bị ${brand.name} chính hãng cho nhà máy — tư vấn chọn mã, báo giá nhanh.` : null)
        }
        crumbs={[
          ...(isLanding ? [] : [{ href: "/san-pham", label: "Sản phẩm" }]),
          ...(group && category && group.slug !== category.slug ? [{ href: href(`/danh-muc-san-pham/${group.slug}`, undefined), label: group.name }] : []),
          ...(category && brand ? [{ href: href(`/danh-muc-san-pham/${category.slug}`, undefined), label: category.name }] : []),
          { label: category && brand ? brand.name : category?.name ?? (brand ? brand.name : isLanding ? "Sản phẩm" : "Tìm kiếm") },
        ]}
      >
        <SearchBox big={isLanding} defaultValue={params.q} action={basePath} brand={params.brand} />
      </ProductHero>

      <div className="container-page py-10">
        <CatalogNavProvider>
          {isLanding ? (
            page === 1 && <Landing brands={brands} tree={tree} pairs={pairs} />
          ) : (
            <Choices
              pairs={pairs}
              tree={tree}
              category={category}
              group={group}
              brandSlug={params.brand}
              brands={brands}
              href={href}
            />
          )}

          <CatalogResults>
            <div id="danh-sach" className="mb-5 flex scroll-mt-32 flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-steel-900">
                {isLanding ? "Tất cả sản phẩm" : params.q ? <>Kết quả cho “{params.q}”</> : "Sản phẩm"}{" "}
                <span className="text-sm font-semibold text-slate-500">({total})</span>
              </h2>
              <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1">
                <span className="shrink-0 text-xs font-semibold text-slate-500">Sắp xếp:</span>
                {(Object.keys(PRODUCT_SORTS) as ProductSort[]).map((s) => {
                  const sp = new URLSearchParams();
                  if (params.brand) sp.set("thuong-hieu", params.brand);
                  if (params.q) sp.set("q", params.q);
                  if (s !== "noi-bat") sp.set("sap-xep", s);
                  const qs = sp.toString();
                  return (
                    <NavLink key={s} href={qs ? `${basePath}?${qs}` : basePath} className={`${chip(sort === s)} px-3 py-1.5 text-xs`} pendingClassName={`${chip(true)} px-3 py-1.5 text-xs`}>
                      {PRODUCT_SORTS[s]}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {items.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <Pagination
                  page={page}
                  total={total}
                  pageSize={PAGE_SIZE}
                  basePath={basePath}
                  params={{ "thuong-hieu": params.brand, q: params.q, "sap-xep": sort === "noi-bat" ? undefined : sort }}
                />
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <Icon name="search" className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 font-semibold text-slate-700">Chưa có sản phẩm phù hợp trên website.</p>
                <p className="mt-1 text-sm text-slate-500">Gửi mã hàng bạn cần — chúng tôi tìm và báo giá ngay.</p>
                <Link href="/lien-he" className="btn-primary mt-5">Gửi mã hàng cần báo giá</Link>
              </div>
            )}
          </CatalogResults>
        </CatalogNavProvider>

        <div className="mt-14">
          <CtaBanner
            title="Không tìm thấy sản phẩm bạn cần?"
            text="Gửi mã hàng hoặc ảnh tem nhãn, chúng tôi tìm và báo giá cho bạn — kể cả hãng chưa có trên website."
            phone={settings.phone}
            zalo={settings.zalo}
          />
        </div>
      </div>
    </>
  );
}

/** Search box in the page banner: large on the landing view, compact once something is chosen. */
function SearchBox({ big, defaultValue, action, brand }: { big: boolean; defaultValue?: string; action: string; brand?: string }) {
  return (
    <div className="mt-6 max-w-2xl">
      <Form action={action} className="relative">
        {brand && <input type="hidden" name="thuong-hieu" value={brand} />}
        <Icon name="search" className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-slate-500" />
        <input
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Nhập mã hàng hoặc tên sản phẩm…"
          aria-label="Tìm sản phẩm"
          className={`w-full rounded-full border-0 bg-white pr-32 pl-13 text-slate-900 shadow-xl shadow-black/20 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-300 focus:outline-none ${big ? "h-14 text-base" : "h-12 text-sm"}`}
        />
        <button type="submit" className={`btn-primary absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full px-6 ${big ? "h-11" : "h-9 text-sm"}`}>
          Tìm kiếm
        </button>
      </Form>
      {big && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/75">
          Ví dụ:
          {SEARCH_EXAMPLES.map((q) => (
            <Link key={q} href={`/san-pham?q=${encodeURIComponent(q)}`} className="rounded-full bg-white/10 px-2.5 py-0.5 text-white hover:bg-white/20">
              {q}
            </Link>
          ))}
        </p>
      )}
    </div>
  );
}

/** Step 1: brands first, then product types — only what has products. */
function Landing({ brands, tree, pairs }: { brands: Brand[]; tree: CategoryNode[]; pairs: ProductPair[] }) {
  const byBrand = countByBrand(pairs);
  const byCat = countByCategory(tree, pairs);
  const top = featuredBrands(brands).filter((b) => (byBrand.get(b.slug) ?? 0) > 0);
  const groups = nonEmptyTree(tree, byCat);
  const otherBrands = brands.filter((b) => (byBrand.get(b.slug) ?? 0) > 0 && !top.some((t) => t.slug === b.slug));

  return (
    <div className="mb-14 space-y-12">
      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold text-steel-900 sm:text-2xl">Chọn theo hãng</h2>
          <Link href="/thuong-hieu" className="shrink-0 text-sm font-semibold text-steel-600 hover:text-brand-600">Tất cả hãng →</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {top.map((b) => (
            <NavLink
              key={b.slug}
              href={`/san-pham?thuong-hieu=${b.slug}`}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-lg"
              pendingClassName="flex flex-col items-center justify-center gap-3 rounded-2xl border border-steel-600 bg-steel-50 p-5 text-center"
            >
              <span className="flex h-12 w-full items-center justify-center">
                <BrandLogo brand={b} className="max-h-11" />
              </span>
              <span className="text-xs font-semibold text-slate-500 group-hover:text-brand-600">{byBrand.get(b.slug)} sản phẩm →</span>
            </NavLink>
          ))}
        </div>
        {otherBrands.length > 0 && (
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            Hãng khác:
            {otherBrands.map((b) => (
              <NavLink key={b.slug} href={`/san-pham?thuong-hieu=${b.slug}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 hover:border-steel-500" pendingClassName="rounded-full border border-steel-600 bg-steel-700 px-3 py-1 font-semibold text-white">
                {b.name} <span className="text-slate-400">{byBrand.get(b.slug)}</span>
              </NavLink>
            ))}
          </p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-steel-900 sm:text-2xl">Hoặc chọn theo loại hàng</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {groups.map((g) => (
            <NavLink
              key={g.slug}
              href={`/danh-muc-san-pham/${g.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-lg"
              pendingClassName="flex items-center gap-3 rounded-2xl border border-steel-600 bg-steel-50 p-3"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                {g.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={categoryThumb(g.image_url)} alt="" loading="lazy" className="h-full w-full object-contain p-1" />
                ) : (
                  <Icon name={g.icon ?? "box"} className="h-6 w-6 text-steel-600" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-sm leading-snug font-semibold text-slate-900 group-hover:text-brand-600">{g.name}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{byCat.get(g.slug)} sản phẩm</span>
              </span>
            </NavLink>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Step 2: one row of chips with what exists inside the chosen brand / product type. */
function Choices({
  pairs,
  tree,
  category,
  group,
  brandSlug,
  brands,
  href,
}: {
  pairs: ProductPair[];
  tree: CategoryNode[];
  category?: Category;
  group?: CategoryNode;
  brandSlug?: string;
  brands: Brand[];
  href: (path: string, brandSlug?: string) => string;
}) {
  const rows: { label: string; items: { key: string; label: string; count: number; href: string; active: boolean; img?: string | null }[] }[] = [];

  if (category && group) {
    // Product types inside the group (counted for the chosen brand, if any)
    const scoped = brandSlug ? pairs.filter((p) => p.brand === brandSlug) : pairs;
    const byCat = countByCategory(tree, scoped);
    const subs = group.children.filter((c) => (byCat.get(c.slug) ?? 0) > 0);
    if (subs.length > 1 || (subs.length === 1 && category.slug !== group.slug && subs[0].slug !== category.slug)) {
      rows.push({
        label: "Loại",
        items: [
          { key: group.slug, label: `Tất cả ${group.name}`, count: byCat.get(group.slug) ?? 0, href: href(`/danh-muc-san-pham/${group.slug}`), active: category.slug === group.slug },
          ...subs.map((c) => ({ key: c.slug, label: c.name, count: byCat.get(c.slug) ?? 0, href: href(`/danh-muc-san-pham/${c.slug}`), active: category.slug === c.slug, img: c.image_url })),
        ],
      });
    }
    // Brands inside the chosen category (group = group + its sub-categories)
    const inScope = new Set(category.slug === group.slug ? [group.slug, ...group.children.map((c) => c.slug)] : [category.slug]);
    const byBrand = countByBrand(pairs.filter((p) => p.category && inScope.has(p.category)));
    const present = brands.filter((b) => (byBrand.get(b.slug) ?? 0) > 0).sort((a, b) => (byBrand.get(b.slug) ?? 0) - (byBrand.get(a.slug) ?? 0));
    if (present.length > 1 || brandSlug) {
      rows.push({
        label: "Hãng",
        items: [
          { key: "all", label: "Tất cả hãng", count: [...byBrand.values()].reduce((a, b) => a + b, 0), href: href(`/danh-muc-san-pham/${category.slug}`, ""), active: !brandSlug },
          ...present.map((b) => ({ key: b.slug, label: b.name, count: byBrand.get(b.slug) ?? 0, href: href(`/danh-muc-san-pham/${category.slug}`, b.slug), active: brandSlug === b.slug })),
        ],
      });
    }
  } else if (brandSlug) {
    // A brand on its own: its product groups (not sub-categories, to keep the row short), most products first
    const groupOfSlug = new Map<string, CategoryNode>();
    for (const g of tree) [g.slug, ...g.children.map((c) => c.slug)].forEach((slug) => groupOfSlug.set(slug, g));
    const counts = new Map<string, number>();
    for (const p of pairs) {
      const g = p.brand === brandSlug && p.category ? groupOfSlug.get(p.category) : undefined;
      if (g) counts.set(g.slug, (counts.get(g.slug) ?? 0) + 1);
    }
    const types = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    if (types.length > 1) {
      rows.push({
        label: "Loại",
        items: [
          { key: "all", label: "Tất cả", count: types.reduce((n, [, c]) => n + c, 0), href: href("/san-pham"), active: true },
          ...types.map(([slug, c]) => {
            const g = tree.find((x) => x.slug === slug)!;
            return { key: slug, label: g.name, count: c, href: href(`/danh-muc-san-pham/${slug}`), active: false, img: g.image_url };
          }),
        ],
      });
    }
  }

  return (
    <div className="mb-8 space-y-3">
      <Link href="/san-pham" className="inline-flex items-center gap-1.5 text-sm font-semibold text-steel-600 hover:text-brand-600">
        <Icon name="arrow" className="h-4 w-4 rotate-180" /> Đổi hãng / loại hàng
      </Link>
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-3">
          <span className="w-12 shrink-0 pt-2 text-xs font-bold tracking-wider text-slate-400 uppercase">{row.label}</span>
          <div className="-mr-4 flex min-w-0 flex-1 gap-2 overflow-x-auto pr-4 pb-1 sm:mr-0 sm:flex-wrap sm:pr-0">
            {row.items.map((it) => (
              <NavLink key={it.key} href={it.href} className={`${chip(it.active)} ${it.img ? "py-1 pl-1" : ""}`} pendingClassName={`${chip(true)} ${it.img ? "py-1 pl-1" : ""}`}>
                {it.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={categoryThumb(it.img)} alt="" loading="lazy" className="h-7 w-7 rounded-full bg-white object-contain ring-1 ring-slate-200" />
                )}
                {it.label}
                <span className={countBadge(it.active)}>{it.count}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

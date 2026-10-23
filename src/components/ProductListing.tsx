import Link from "next/link";
import { buildCategoryTree, getBrands, getCategories, getProductsPage, getSettings, PRODUCT_SORTS, type ProductSort } from "@/lib/data";
import { CtaBanner } from "./CtaBanner";
import { Icon } from "./Icon";
import { PageHeader } from "./PageHeader";
import { Pagination } from "./Pagination";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

const PAGE_SIZE = 12;

export type ListingParams = { brand?: string; q?: string; sort?: string; page?: number };

/** Product catalogue body shared by /san-pham and /danh-muc-san-pham/[slug]. */
export async function ProductListing({ categorySlug, params }: { categorySlug?: string; params: ListingParams }) {
  const sort: ProductSort = params.sort && params.sort in PRODUCT_SORTS ? (params.sort as ProductSort) : "noi-bat";
  const page = Math.max(1, params.page ?? 1);

  const [categories, brands, settings, { items, total }] = await Promise.all([
    getCategories(),
    getBrands(),
    getSettings(),
    getProductsPage({ category: categorySlug, brand: params.brand, q: params.q, sort, page, pageSize: PAGE_SIZE }),
  ]);

  const tree = buildCategoryTree(categories);
  const category = categories.find((c) => c.slug === categorySlug);
  const parent = category?.parent_id ? categories.find((c) => c.id === category.parent_id) : undefined;
  // The group whose sub-categories are shown: the category itself, or its parent.
  const group = tree.find((g) => g.slug === (parent ?? category)?.slug);
  const brand = brands.find((b) => b.slug === params.brand);
  const basePath = category ? `/danh-muc-san-pham/${category.slug}` : "/san-pham";
  const title = category?.name ?? (brand ? `Sản phẩm ${brand.name}` : "Sản phẩm");

  /** Link to this listing with some params changed (always resets to page 1). */
  const href = (next: Partial<{ brand: string | undefined; sort: string | undefined }>, path = basePath) => {
    const sp = new URLSearchParams();
    const merged = { brand: params.brand, q: params.q, sort: sort === "noi-bat" ? undefined : sort, ...next };
    if (merged.brand) sp.set("thuong-hieu", merged.brand);
    if (merged.q) sp.set("q", merged.q);
    if (merged.sort && merged.sort !== "noi-bat") sp.set("sap-xep", merged.sort);
    const s = sp.toString();
    return s ? `${path}?${s}` : path;
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
      active ? "border-steel-600 bg-steel-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-steel-500"
    }`;

  return (
    <>
      <PageHeader
        title={title}
        description={
          category?.description ??
          (parent ? `Thuộc nhóm ${parent.name}.` : "Thiết bị điện công nghiệp, tự động hóa, khí nén – thủy lực, motor – hộp giảm tốc và phụ kiện đường ống.")
        }
        crumbs={
          category
            ? [
                { href: "/san-pham", label: "Sản phẩm" },
                ...(parent ? [{ href: `/danh-muc-san-pham/${parent.slug}`, label: parent.name }] : []),
                { label: category.name },
              ]
            : [{ label: "Sản phẩm" }]
        }
      />

      <div className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="order-2 space-y-5 lg:order-none lg:sticky lg:top-28 lg:self-start">
            <form action={basePath} className="relative">
              {params.brand && <input type="hidden" name="thuong-hieu" value={params.brand} />}
              <input name="q" type="search" defaultValue={params.q} placeholder="Tên, mã sản phẩm…" className="input h-11 rounded-xl pr-10" aria-label="Tìm kiếm" />
              <Icon name="search" className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="mb-2 px-2 text-xs font-bold tracking-wider text-slate-500 uppercase">Danh mục sản phẩm</h2>
              <ul className="space-y-0.5 text-sm">
                <li>
                  <Link href={href({}, "/san-pham")} className={`flex items-center gap-2 rounded-lg px-2 py-2 ${!category ? "bg-brand-50 font-semibold text-brand-600" : "text-slate-700 hover:bg-slate-50"}`}>
                    <Icon name="box" className="h-4 w-4" /> Tất cả sản phẩm
                  </Link>
                </li>
                {tree.map((g) => {
                  const open = group?.slug === g.slug;
                  return (
                    <li key={g.slug}>
                      <Link
                        href={href({}, `/danh-muc-san-pham/${g.slug}`)}
                        className={`flex items-center gap-2 rounded-lg px-2 py-2 ${
                          category?.slug === g.slug ? "bg-brand-50 font-semibold text-brand-600" : open ? "font-semibold text-slate-900" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <Icon name={g.icon ?? "box"} className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{g.name}</span>
                        {g.children.length > 0 && <span className="text-xs text-slate-400">{open ? "−" : "+"}</span>}
                      </Link>
                      {open && g.children.length > 0 && (
                        <ul className="my-1 ml-4 space-y-0.5 border-l border-slate-200 pl-2">
                          {g.children.map((c) => (
                            <li key={c.slug}>
                              <Link
                                href={href({}, `/danh-muc-san-pham/${c.slug}`)}
                                className={`block rounded-lg px-2 py-1.5 text-[13px] ${
                                  category?.slug === c.slug ? "bg-brand-50 font-semibold text-brand-600" : "text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {c.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="mb-3 px-1 text-xs font-bold tracking-wider text-slate-500 uppercase">Thương hiệu</h2>
              <div className="flex flex-wrap gap-2">
                <Link href={href({ brand: undefined })} className={chip(!params.brand)}>Tất cả</Link>
                {brands.map((b) => (
                  <Link key={b.slug} href={href({ brand: b.slug })} className={chip(params.brand === b.slug)}>{b.name}</Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            {group && group.children.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                <Link href={href({}, `/danh-muc-san-pham/${group.slug}`)} className={chip(category?.slug === group.slug)}>
                  Tất cả {group.name}
                </Link>
                {group.children.map((c) => (
                  <Link key={c.slug} href={href({}, `/danh-muc-san-pham/${c.slug}`)} className={chip(category?.slug === c.slug)}>
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm text-slate-500">
                {params.q && <>Kết quả cho “<span className="font-semibold text-slate-800">{params.q}</span>” · </>}
                <span className="font-semibold text-slate-800">{total}</span> sản phẩm
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Sắp xếp:</span>
                {(Object.keys(PRODUCT_SORTS) as ProductSort[]).map((s) => (
                  <Link key={s} href={href({ sort: s })} className={chip(sort === s)}>{PRODUCT_SORTS[s]}</Link>
                ))}
              </div>
            </div>

            {items.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {items.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 3) * 70}>
                      <ProductCard product={p} />
                    </Reveal>
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
                <p className="mt-1 text-sm text-slate-500">Hãy gửi mã hàng bạn cần — chúng tôi sẽ tìm và báo giá ngay.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-14">
          <CtaBanner
            title="Không tìm thấy sản phẩm bạn cần?"
            text="Danh mục trên website chưa đầy đủ. Gửi mã hàng hoặc ảnh tem nhãn, chúng tôi tìm và báo giá cho bạn."
            phone={settings.phone}
            zalo={settings.zalo}
          />
        </div>
      </div>
    </>
  );
}

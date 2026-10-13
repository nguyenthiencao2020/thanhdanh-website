import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { getBrands, getCategories, getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Sản phẩm" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const category = one(sp["danh-muc"]);
  const brand = one(sp["thuong-hieu"]);
  const q = one(sp.q);

  const [categories, brands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts({ category, brand, q }),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);
  const activeBrand = brands.find((b) => b.slug === brand);

  const href = (next: { category?: string; brand?: string }) => {
    const params = new URLSearchParams();
    if (next.category) params.set("danh-muc", next.category);
    if (next.brand) params.set("thuong-hieu", next.brand);
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `/san-pham?${s}` : "/san-pham";
  };

  const title = activeCategory?.name ?? (activeBrand ? `Sản phẩm ${activeBrand.name}` : "Tất cả sản phẩm");

  return (
    <div className="container-page py-10">
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-600">Trang chủ</Link> / <span>Sản phẩm</span>
      </nav>
      <h1 className="mt-2 text-2xl font-bold text-steel-900 sm:text-3xl">{title}</h1>
      {activeCategory?.description && <p className="mt-2 max-w-3xl text-slate-500">{activeCategory.description}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <form action="/san-pham" className="relative">
            {category && <input type="hidden" name="danh-muc" value={category} />}
            {brand && <input type="hidden" name="thuong-hieu" value={brand} />}
            <input name="q" type="search" defaultValue={q} placeholder="Tên, mã sản phẩm…" className="input pr-9" aria-label="Tìm kiếm" />
            <Icon name="search" className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </form>

          <div>
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 uppercase">Danh mục</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href={href({ brand })} className={`block rounded px-3 py-1.5 ${!category ? "bg-brand-50 font-semibold text-brand-600" : "hover:bg-slate-50"}`}>
                  Tất cả
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={href({ category: c.slug, brand })}
                    className={`block rounded px-3 py-1.5 ${category === c.slug ? "bg-brand-50 font-semibold text-brand-600" : "hover:bg-slate-50"}`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 uppercase">Thương hiệu</h2>
            <div className="flex flex-wrap gap-2">
              <Link href={href({ category })} className={`rounded-full border px-3 py-1 text-xs ${!brand ? "border-steel-600 bg-steel-600 text-white" : "border-slate-300 hover:border-steel-500"}`}>
                Tất cả
              </Link>
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  href={href({ category, brand: b.slug })}
                  className={`rounded-full border px-3 py-1 text-xs ${brand === b.slug ? "border-steel-600 bg-steel-600 text-white" : "border-slate-300 hover:border-steel-500"}`}
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {q && (
            <p className="mb-4 text-sm text-slate-500">
              Kết quả tìm kiếm cho “<span className="font-semibold text-slate-800">{q}</span>”: {products.length} sản phẩm
            </p>
          )}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
              <p className="font-semibold text-slate-700">Chưa tìm thấy sản phẩm phù hợp.</p>
              <p className="mt-1 text-sm text-slate-500">
                Danh mục trên website chưa đầy đủ — hãy gửi mã hàng bạn cần, chúng tôi sẽ báo giá ngay.
              </p>
              <Link href="/lien-he" className="btn-primary mt-5">Gửi yêu cầu báo giá</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

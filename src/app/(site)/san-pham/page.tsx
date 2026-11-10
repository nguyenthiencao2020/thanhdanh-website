import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { LineCard } from "@/components/LineCard";
import { LinesShell } from "@/components/LinesShell";
import { ProductCard } from "@/components/ProductCard";
import { QuoteForm } from "@/components/QuoteForm";
import { productThumb } from "@/lib/utils";
import { getProductsPage } from "@/lib/data";
import { getBrandsWithLines, lineHref, linesForSearch } from "@/lib/lines";

export const metadata: Metadata = { title: "Sản phẩm" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  // Old links: ?danh-muc=… → category page, ?thuong-hieu=… → the brand's product lines.
  const category = one(sp["danh-muc"]);
  if (category) redirect(`/danh-muc-san-pham/${encodeURIComponent(category)}`);
  const brandParam = one(sp["thuong-hieu"]);
  const brands = await getBrandsWithLines();
  if (brandParam && /^[a-z0-9-]+$/.test(brandParam)) redirect(`/thuong-hieu/${brandParam}`);

  const q = one(sp.q)?.trim();
  if (q) {
    const name = (slug: string) => brands.find((b) => b.brand.slug === slug)?.brand.name ?? "";
    const products = await getProductsPage({ q, pageSize: 24 });
    const found = linesForSearch(q, name, products.items.map((p) => p.slug));
    const none = !found.length && !products.total;
    return (
      <LinesShell
        q={q}
        crumbs={[{ href: "/san-pham", label: "Sản phẩm" }, { label: "Tìm kiếm" }]}
        lead="Kết quả cho"
        accent={`“${q}”`}
        description={none ? "Chưa có trên website — gửi mã để được báo giá ngay." : `${found.length} dòng hàng · ${products.total} sản phẩm phù hợp.`}
      >
        {found.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-steel-900">Dòng hàng <span className="font-semibold text-slate-500">({found.length})</span></h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {found.map((l) => (
                <LineCard key={`${l.brand}-${l.slug}`} href={lineHref(l)} brandName={name(l.brand)} name={l.name} series={l.series} image={l.image_url} />
              ))}
            </div>
          </section>
        )}
        {products.total > 0 && (
          <section className={found.length ? "mt-8" : ""}>
            <h2 className="text-lg font-bold text-steel-900">Sản phẩm <span className="font-semibold text-slate-500">({products.total})</span></h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.items.map((p) => (
                <ProductCard key={p.id} product={p} hideBadge />
              ))}
            </div>
          </section>
        )}
        <section id="bao-gia" className={`scroll-mt-28 rounded-3xl border bg-white p-5 sm:p-7 ${none ? "border-brand-200 ring-4 ring-brand-50" : "mt-8 border-slate-200"}`}>
          <h2 className="text-lg font-bold text-steel-900">
            {none ? <>Chưa thấy “{q}” trên website — gửi mã này để báo giá</> : <>Không thấy đúng mã cần? Gửi yêu cầu báo giá</>}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Đạt Danh luôn sẵn sàng cung cấp cả những mã chưa có trên website. Ghi số lượng, có thể kèm ảnh tem nhãn — phản hồi nhanh trong giờ làm việc.
          </p>
          <QuoteForm compact defaultMessage={`Mã cần báo giá: ${q}\nSố lượng: `} />
        </section>
      </LinesShell>
    );
  }

  return (
    <LinesShell
      crumbs={[{ label: "Sản phẩm" }]}
      lead="Sản phẩm"
      accent="chính hãng"
      description="Chọn hãng ở menu bên trái để xem các dòng hàng, hoặc tìm theo mã hàng / series."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {brands.map(({ brand, lines }) => (
          <section key={brand.slug} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <Link scroll={false} href={`/thuong-hieu/${brand.slug}`} className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-28 shrink-0 items-center">
                  {brand.logo_url ? <BrandLogo brand={brand} className="max-h-9" /> : <span className="text-base font-extrabold text-steel-900">{brand.name}</span>}
                </span>
              </Link>
              <Link scroll={false} href={`/thuong-hieu/${brand.slug}`} className="shrink-0 text-sm font-semibold text-steel-600 hover:text-brand-600">
                {lines.length} dòng hàng →
              </Link>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-1.5">
              {lines.slice(0, 6).map((l) => (
                <li key={l.slug}>
                  <Link scroll={false} href={lineHref(l)} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
                      {l.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={productThumb(l.image_url)} alt="" loading="lazy" className="h-full w-full object-contain p-0.5" />
                      )}
                    </span>
                    <span className="min-w-0 leading-snug">{l.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {lines.length > 6 && (
              <Link scroll={false} href={`/thuong-hieu/${brand.slug}`} className="mt-2 inline-block px-2 text-xs font-semibold text-slate-500 hover:text-brand-600">
                + {lines.length - 6} dòng hàng khác
              </Link>
            )}
          </section>
        ))}
      </div>
    </LinesShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { LineCard } from "@/components/LineCard";
import { LinesShell } from "@/components/LinesShell";
import { getBrandsWithLines, lineHref, searchLines } from "@/lib/lines";

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
  if (brandParam && brands.some((b) => b.brand.slug === brandParam)) redirect(`/thuong-hieu/${brandParam}`);

  const q = one(sp.q)?.trim();
  if (q) {
    const name = (slug: string) => brands.find((b) => b.brand.slug === slug)?.brand.name ?? "";
    const found = searchLines(q, name);
    return (
      <LinesShell q={q} crumbs={[{ href: "/san-pham", label: "Sản phẩm" }, { label: "Tìm kiếm" }]} lead="Kết quả cho" accent={`“${q}”`} description={`${found.length} dòng hàng phù hợp.`}>
        {found.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {found.map((l) => (
              <LineCard key={`${l.brand}-${l.slug}`} href={lineHref(l)} brandName={name(l.brand)} name={l.name} series={l.series} image={l.image_url} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="font-semibold text-slate-700">Chưa thấy “{q}” trên website.</p>
            <p className="mt-1 text-sm text-slate-500">Chúng tôi cung cấp nhiều mã chưa đăng — gửi mã hàng để được báo giá ngay.</p>
            <Link href="/lien-he" className="btn-primary mt-5">Gửi mã cần báo giá</Link>
          </div>
        )}
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
              <Link href={`/thuong-hieu/${brand.slug}`} className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-28 shrink-0 items-center">
                  {brand.logo_url ? <BrandLogo brand={brand} className="max-h-9" /> : <span className="text-base font-extrabold text-steel-900">{brand.name}</span>}
                </span>
              </Link>
              <Link href={`/thuong-hieu/${brand.slug}`} className="shrink-0 text-sm font-semibold text-steel-600 hover:text-brand-600">
                {lines.length} dòng hàng →
              </Link>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-1.5">
              {lines.slice(0, 6).map((l) => (
                <li key={l.slug}>
                  <Link href={lineHref(l)} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
                      {l.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={l.image_url} alt="" loading="lazy" className="h-full w-full object-contain p-0.5" />
                      )}
                    </span>
                    <span className="min-w-0 leading-snug">{l.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {lines.length > 6 && (
              <Link href={`/thuong-hieu/${brand.slug}`} className="mt-2 inline-block px-2 text-xs font-semibold text-slate-500 hover:text-brand-600">
                + {lines.length - 6} dòng hàng khác
              </Link>
            )}
          </section>
        ))}
      </div>
    </LinesShell>
  );
}

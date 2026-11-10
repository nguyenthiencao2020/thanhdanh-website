import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { LineCard } from "@/components/LineCard";
import { LinesShell } from "@/components/LinesShell";
import { ProductCard } from "@/components/ProductCard";
import { getBrands, getProducts } from "@/lib/data";
import { getBrandsWithLines, lineHref, lineOfProduct } from "@/lib/lines";

type Params = Promise<{ brand: string }>;

export async function generateStaticParams() {
  return [];
}

/**
 * A brand's product lines, plus its products that are not in any line yet (e.g. added in Admin
 * after the line list was made) — so every brand that has products has a page.
 */
async function load(slug: string) {
  const [withLines, brands] = await Promise.all([getBrandsWithLines(), getBrands()]);
  const b = withLines.find((x) => x.brand.slug === slug);
  const brand = b?.brand ?? brands.find((x) => x.slug === slug);
  if (!brand) return null;
  const extra = slug === "hang-thong-dung" ? [] : (await getProducts({ brand: slug })).filter((p) => !lineOfProduct(p.slug));
  const lines = b?.lines ?? [];
  if (!lines.length && !extra.length) return null;
  return { brand, lines, extra };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand } = await params;
  const d = await load(brand);
  if (!d) return {};
  const names = [...d.lines.map((l) => l.name), ...d.extra.map((p) => p.name)].slice(0, 12);
  return { title: `Sản phẩm ${d.brand.name}`, description: `Thiết bị ${d.brand.name}: ${names.join(", ")}. Tư vấn chọn mã, báo giá nhanh.` };
}

export default async function BrandLinesPage({ params }: { params: Params }) {
  const { brand } = await params;
  const d = await load(brand);
  if (!d) notFound();
  const { lines, extra } = d;
  const b = d.brand;
  const summary = [lines.length && `${lines.length} dòng hàng`, extra.length && `${extra.length} sản phẩm`].filter(Boolean).join(" · ");
  return (
    <LinesShell
      brand={brand}
      crumbs={[{ href: "/san-pham", label: "Sản phẩm" }, { label: b.name }]}
      lead="Sản phẩm"
      accent={b.name}
      description={lines.length ? `${lines.length} dòng hàng — chọn dòng để xem các series và gửi yêu cầu báo giá.` : "Chọn sản phẩm để xem chi tiết và gửi yêu cầu báo giá."}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center gap-4">
          {b.logo_url && <BrandLogo brand={b} className="max-h-10" />}
          <h2 className="text-lg font-bold text-steel-900">{summary} {b.name}</h2>
        </div>
        <Link href="/lien-he" className="btn-primary">Báo giá hàng {b.name}</Link>
      </div>
      {lines.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {lines.map((l) => (
            <LineCard key={l.slug} href={lineHref(l)} name={l.name} series={l.series} image={l.image_url} />
          ))}
        </div>
      )}
      {extra.length > 0 && (
        <section className="mt-8">
          {lines.length > 0 && <h2 className="text-lg font-bold text-steel-900">Sản phẩm khác của {b.name}</h2>}
          <div className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 ${lines.length ? "mt-3" : "mt-5"}`}>
            {extra.map((p) => (
              <ProductCard key={p.id} product={p} hideBadge />
            ))}
          </div>
        </section>
      )}
    </LinesShell>
  );
}

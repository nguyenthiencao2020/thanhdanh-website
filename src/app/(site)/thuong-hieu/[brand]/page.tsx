import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { LineCard } from "@/components/LineCard";
import { LinesShell } from "@/components/LinesShell";
import { ProductCard } from "@/components/ProductCard";
import { QuoteForm } from "@/components/QuoteForm";
import { getBrands, getProducts } from "@/lib/data";
import { getBrandsWithLines, lineHref, lineOfProduct } from "@/lib/lines";

type Params = Promise<{ brand: string }>;

export async function generateStaticParams() {
  return [];
}

/**
 * A brand's product lines, plus its products that are not in any line yet (e.g. added in Admin
 * after the line list was made). Brands with nothing listed yet still get a short page (Đạt Danh
 * supplies every brand it lists).
 */
async function load(slug: string) {
  const [withLines, brands] = await Promise.all([getBrandsWithLines(), getBrands()]);
  const b = withLines.find((x) => x.brand.slug === slug);
  const brand = b?.brand ?? brands.find((x) => x.slug === slug);
  if (!brand) return null;
  const extra = slug === "hang-thong-dung" ? [] : (await getProducts({ brand: slug })).filter((p) => !lineOfProduct(p.slug));
  const lines = b?.lines ?? [];
  // Other brands that do have product lines, for the "on request" page.
  const featured = withLines.filter((x) => x.brand.slug !== slug && x.brand.slug !== "hang-thong-dung").slice(0, 8).map((x) => x.brand);
  return { brand, lines, extra, featured };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand } = await params;
  const d = await load(brand);
  if (!d) return {};
  const names = [...d.lines.map((l) => l.name), ...d.extra.map((p) => p.name)].slice(0, 12);
  if (!names.length) {
    return { title: `Thiết bị ${d.brand.name}`, description: `Đạt Danh cung cấp thiết bị ${d.brand.name} chính hãng cho nhà máy và tủ điện — luôn sẵn sàng tư vấn đúng mã, báo giá nhanh.` };
  }
  return { title: `Sản phẩm ${d.brand.name}`, description: `Thiết bị ${d.brand.name}: ${names.join(", ")}. Tư vấn chọn mã, báo giá nhanh.` };
}

export default async function BrandLinesPage({ params }: { params: Params }) {
  const { brand } = await params;
  const d = await load(brand);
  if (!d) notFound();
  const { lines, extra, featured } = d;
  const b = d.brand;

  // Supplied on request: nothing listed on the website yet.
  if (!lines.length && !extra.length) {
    return (
      <LinesShell
        brand={brand}
        crumbs={[{ href: "/thuong-hieu", label: "Thương hiệu" }, { label: b.name }]}
        lead="Thiết bị"
        accent={b.name}
        description="Luôn sẵn sàng cung cấp — gửi mã hàng hoặc ảnh tem nhãn để được tư vấn và báo giá nhanh."
      >
        <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="grid items-center gap-6 sm:grid-cols-[200px_minmax(0,1fr)]">
            <div className="flex h-28 items-center justify-center rounded-2xl border border-slate-100 bg-white p-4">
              <BrandLogo brand={b} className="max-h-20" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-steel-900">Thiết bị {b.name} chính hãng</h2>
              <p className="mt-2 leading-relaxed text-slate-600">
                Đạt Danh cung cấp thiết bị {b.name} chính hãng cho nhà máy và tủ điện công nghiệp. Gửi mã hàng, ảnh tem nhãn hoặc mô tả thiết bị — đội ngũ kỹ thuật luôn sẵn sàng tư vấn đúng mã và báo giá nhanh cho bạn.
              </p>
            </div>
          </div>
        </article>

        <section id="bao-gia" className="mt-6 scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-bold text-steel-900">Yêu cầu báo giá thiết bị {b.name}</h2>
          <p className="mt-1 text-sm text-slate-500">Ghi mã hàng (model), số lượng — có thể đính kèm ảnh tem nhãn ngay bên dưới.</p>
          <QuoteForm compact defaultMessage={`Báo giá thiết bị ${b.name}\nMã hàng: \nSố lượng: `} />
        </section>

        {featured.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-steel-900">Hãng có sẵn sản phẩm trên website</h2>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {featured.map((x) => (
                <li key={x.slug}>
                  <Link scroll={false} href={`/thuong-hieu/${x.slug}`} className="flex h-16 items-center justify-center rounded-xl border border-slate-200 bg-white p-3 transition hover:border-steel-500 hover:shadow-md" title={x.name}>
                    <BrandLogo brand={x} className="max-h-9" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/thuong-hieu" className="mt-3 inline-block py-2 text-sm font-semibold text-steel-600 hover:text-brand-600">Xem tất cả thương hiệu →</Link>
          </section>
        )}
      </LinesShell>
    );
  }
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

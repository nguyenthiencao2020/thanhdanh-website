import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components/Icon";
import { LinesShell } from "@/components/LinesShell";
import { QuoteForm } from "@/components/QuoteForm";
import { getSettings } from "@/lib/data";
import { getBrandsWithLines, lineHref } from "@/lib/lines";
import { phoneDigits } from "@/lib/utils";

type Params = Promise<{ brand: string; line: string }>;

export async function generateStaticParams() {
  return [];
}

async function find(brand: string, line: string) {
  const b = (await getBrandsWithLines()).find((x) => x.brand.slug === brand);
  const l = b?.lines.find((x) => x.slug === line);
  return b && l ? { b, l } : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand, line } = await params;
  const f = await find(brand, line);
  if (!f) return {};
  const brandName = f.b.brand.slug === "hang-thong-dung" ? "" : ` ${f.b.brand.name}`;
  return {
    title: `${f.l.name}${brandName}`,
    description: `${f.l.name}${brandName}: ${f.l.series.join(", ")}. Báo giá nhanh.`,
    openGraph: f.l.image_url ? { images: [f.l.image_url] } : undefined,
  };
}

export default async function LinePage({ params }: { params: Params }) {
  const { brand, line } = await params;
  const [f, settings] = await Promise.all([find(brand, line), getSettings()]);
  if (!f) notFound();
  const { b, l } = f;
  const generic = b.brand.slug === "hang-thong-dung";
  const label = generic ? l.name : `${b.brand.name} – ${l.name}`;
  const others = b.lines.filter((x) => x.slug !== l.slug);

  return (
    <LinesShell
      brand={brand}
      line={line}
      crumbs={[{ href: "/san-pham", label: "Sản phẩm" }, { href: `/thuong-hieu/${b.brand.slug}`, label: b.brand.name }, { label: l.name }]}
      lead={generic ? undefined : b.brand.name}
      accent={l.name}
      description={null}
    >
      <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
        <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-slate-100 bg-white">
            {l.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={l.image_url} alt={label} className="h-full w-full object-contain p-6" />
            )}
          </div>
          <div>
            {!generic && b.brand.logo_url && <BrandLogo brand={b.brand} className="max-h-9" />}
            <h2 className="mt-3 text-2xl font-extrabold text-steel-900 sm:text-3xl">{label}</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{l.description}</p>
            <p className="mt-5 text-xs font-bold tracking-wider text-slate-500 uppercase">Series cung cấp</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {l.series.map((s) => (
                <li key={s} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">{s}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">Hình ảnh mang tính minh họa cho dòng sản phẩm; cần mã cụ thể vui lòng ghi vào yêu cầu báo giá.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#bao-gia" className="btn-primary px-6 py-3">Gửi mã cần báo giá</a>
              {settings.phone && (
                <a href={`tel:${phoneDigits(settings.phone)}`} className="btn-secondary px-6 py-3">
                  <Icon name="phone" className="h-4 w-4" /> {settings.phone}
                </a>
              )}
              {settings.zalo && (
                <a href={`https://zalo.me/${phoneDigits(settings.zalo)}`} target="_blank" rel="noopener noreferrer" className="btn-outline px-6 py-3">Zalo</a>
              )}
            </div>
          </div>
        </div>
      </article>

      <section id="bao-gia" className="mt-6 scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
        <h2 className="text-lg font-bold text-steel-900">Yêu cầu báo giá {label}</h2>
        <p className="mt-1 text-sm text-slate-500">Ghi mã hàng (model), số lượng hoặc gửi ảnh tem nhãn qua Zalo — chúng tôi phản hồi nhanh trong giờ làm việc.</p>
        <QuoteForm productName={label} compact />
      </section>

      {others.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-steel-900">Dòng hàng khác {generic ? "" : `của ${b.brand.name}`}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.map((x) => (
              <Link key={x.slug} href={lineHref(x)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pr-4 pl-1 text-sm font-semibold text-slate-700 hover:border-steel-500 hover:text-brand-600">
                {x.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={x.image_url} alt="" loading="lazy" className="h-8 w-8 rounded-full bg-white object-contain ring-1 ring-slate-200" />
                )}
                {x.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </LinesShell>
  );
}

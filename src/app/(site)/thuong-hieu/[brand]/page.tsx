import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { LineCard } from "@/components/LineCard";
import { LinesShell } from "@/components/LinesShell";
import { getBrandsWithLines, lineHref } from "@/lib/lines";

type Params = Promise<{ brand: string }>;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand } = await params;
  const b = (await getBrandsWithLines()).find((x) => x.brand.slug === brand);
  if (!b) return {};
  return { title: `Sản phẩm ${b.brand.name}`, description: `Các dòng thiết bị ${b.brand.name}: ${b.lines.map((l) => l.name).join(", ")}. Tư vấn chọn mã, báo giá nhanh.` };
}

export default async function BrandLinesPage({ params }: { params: Params }) {
  const { brand } = await params;
  const b = (await getBrandsWithLines()).find((x) => x.brand.slug === brand);
  if (!b) notFound();
  return (
    <LinesShell
      brand={brand}
      crumbs={[{ href: "/san-pham", label: "Sản phẩm" }, { label: b.brand.name }]}
      lead="Sản phẩm"
      accent={b.brand.name}
      description={`${b.lines.length} dòng hàng — chọn dòng để xem các series và gửi yêu cầu báo giá.`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center gap-4">
          {b.brand.logo_url && <BrandLogo brand={b.brand} className="max-h-10" />}
          <h2 className="text-lg font-bold text-steel-900">{b.lines.length} dòng hàng {b.brand.name}</h2>
        </div>
        <Link href="/lien-he" className="btn-primary">Báo giá hàng {b.brand.name}</Link>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {b.lines.map((l) => (
          <LineCard key={l.slug} href={lineHref(l)} name={l.name} series={l.series} image={l.image_url} />
        ))}
      </div>
    </LinesShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { PageHeader } from "@/components/PageHeader";
import { getBrands } from "@/lib/data";
import { getBrandsWithLines } from "@/lib/lines";

export const metadata: Metadata = {
  title: "Thương hiệu",
  description: "Đạt Danh cung cấp thiết bị điện, tự động hóa và vật tư nhà máy của hơn 60 thương hiệu — có sẵn trên website hoặc tìm nguồn theo yêu cầu.",
};

export default async function BrandsPage() {
  const [brands, withLines] = await Promise.all([getBrands(), getBrandsWithLines()]);
  const lines = new Map(withLines.map((b) => [b.brand.slug, b.lines.length]));
  // Every brand Đạt Danh supplies. Brands with product lines on the website first (most lines first),
  // then the ones supplied on request, alphabetically.
  const shown = [...brands].sort(
    (a, b) =>
      Number(lines.has(b.slug)) - Number(lines.has(a.slug)) ||
      (lines.get(b.slug) ?? 0) - (lines.get(a.slug) ?? 0) ||
      a.name.localeCompare(b.name, "vi"),
  );
  return (
    <>
      <PageHeader
        title="Thương hiệu phân phối"
        description={`Đạt Danh cung cấp thiết bị của ${brands.length}+ thương hiệu. Hãng chưa có sản phẩm trên website vẫn cung cấp theo yêu cầu — gửi mã hàng hoặc ảnh tem nhãn để được báo giá.`}
        crumbs={[{ label: "Thương hiệu" }]}
      />
      <div className="container-page py-10">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {shown.map((b) => {
            const n = lines.get(b.slug);
            return (
              <li key={b.slug}>
                <Link
                  href={`/thuong-hieu/${b.slug}`}
                  className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl hover:shadow-steel-900/10"
                >
                  <div className="flex h-16 items-center justify-center">
                    <BrandLogo brand={b} className="max-h-14" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-600">{b.name}</span>
                  <span className={`-mt-2 text-xs ${n ? "font-semibold text-steel-600" : "text-slate-500"}`}>
                    {n ? `${n} dòng hàng` : "Cung cấp theo yêu cầu"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="font-semibold text-slate-800">Và nhiều hãng khác theo yêu cầu</p>
          <p className="mt-1 text-sm text-slate-600">Không thấy hãng bạn cần? Gửi mã hàng hoặc ảnh tem nhãn — Đạt Danh tìm nguồn và báo giá cho bạn.</p>
          <Link href="/lien-he" className="btn-primary mt-4">Gửi yêu cầu báo giá</Link>
        </div>
      </div>
    </>
  );
}

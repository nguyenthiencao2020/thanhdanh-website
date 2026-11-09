import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { PageHeader } from "@/components/PageHeader";
import { countByBrand } from "@/lib/catalog";
import { getBrands, getProductPairs } from "@/lib/data";

export const metadata: Metadata = { title: "Thương hiệu" };

export default async function BrandsPage() {
  const [brands, pairs] = await Promise.all([getBrands(), getProductPairs()]);
  const count = countByBrand(pairs);
  // Only brands with products on the website; featured ones first, then by product count.
  const shown = brands
    .filter((b) => (count.get(b.slug) ?? 0) > 0)
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || (count.get(b.slug) ?? 0) - (count.get(a.slug) ?? 0));
  return (
    <>
      <PageHeader
        title="Thương hiệu phân phối"
        description="Chọn một thương hiệu để xem các dòng sản phẩm. Cần hãng hoặc mã hàng chưa có trên website? Gửi yêu cầu, chúng tôi tìm và báo giá cho bạn."
        crumbs={[{ label: "Thương hiệu" }]}
      />
      <div className="container-page py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((b) => (
            <Link
              key={b.slug}
              href={`/thuong-hieu/${b.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl hover:shadow-steel-900/10"
            >
              <div className="flex h-20 items-center justify-center">
                <BrandLogo brand={b} className="max-h-16" />
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-600">{b.name}</span>
              <span className="-mt-2 text-xs text-slate-500">{count.get(b.slug)} sản phẩm</span>
            </Link>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="font-semibold text-slate-800">Không thấy hãng bạn cần?</p>
          <p className="mt-1 text-sm text-slate-500">Chúng tôi cung cấp thiết bị của nhiều hãng khác theo yêu cầu — gửi mã hàng hoặc ảnh tem nhãn để được báo giá.</p>
          <Link href="/lien-he" className="btn-primary mt-4">Gửi yêu cầu báo giá</Link>
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { PageHeader } from "@/components/PageHeader";
import { getBrands } from "@/lib/data";

export const metadata: Metadata = { title: "Thương hiệu" };

export default async function BrandsPage() {
  const brands = await getBrands();
  return (
    <>
    <PageHeader
      title="Thương hiệu phân phối"
      description="Chúng tôi cung cấp thiết bị từ các thương hiệu uy tín. Chọn một thương hiệu để xem sản phẩm, hoặc liên hệ nếu bạn cần mã hàng chưa có trên website."
      crumbs={[{ label: "Thương hiệu" }]}
    />
    <div className="container-page py-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/san-pham?thuong-hieu=${b.slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl hover:shadow-steel-900/10"
          >
            <div className="flex h-20 items-center justify-center">
              <BrandLogo brand={b} className="max-h-16" />
            </div>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-600">{b.name}</span>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { getBrands } from "@/lib/data";

export const metadata: Metadata = { title: "Thương hiệu" };

export default async function BrandsPage() {
  const brands = await getBrands();
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold text-steel-900 sm:text-3xl">Thương hiệu phân phối</h1>
      <p className="mt-2 max-w-2xl text-slate-500">
        Chúng tôi cung cấp thiết bị từ các thương hiệu uy tín. Chọn một thương hiệu để xem sản phẩm, hoặc liên hệ nếu bạn
        cần mã hàng chưa có trên website.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/san-pham?thuong-hieu=${b.slug}`}
            className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 transition hover:border-steel-500 hover:shadow-md"
          >
            <div className="flex h-20 items-center justify-center">
              <BrandLogo brand={b} className="max-h-16" />
            </div>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-600">{b.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

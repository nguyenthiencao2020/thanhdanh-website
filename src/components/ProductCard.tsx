import Link from "next/link";
import type { ProductWithRelations } from "@/lib/types";
import { Icon } from "./Icon";

export function ProductImage({ product, className = "" }: { product: ProductWithRelations; className?: string }) {
  if (product.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.image_url} alt={product.name} loading="lazy" className={`h-full w-full bg-white object-contain ${className}`} />;
  }
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-steel-50 to-cream text-steel-500 ${className}`}>
      <Icon name="box" className="h-12 w-12" />
      {product.brand && <span className="text-xs font-semibold tracking-wide text-steel-700 uppercase">{product.brand.name}</span>}
    </div>
  );
}

export function ProductCard({ product }: { product: ProductWithRelations }) {
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl hover:shadow-steel-900/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <ProductImage product={product} className="transition duration-500 group-hover:scale-105" />
        {product.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-brand-600 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
            Nổi bật
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-slate-100 p-4">
        {product.category && <p className="text-xs font-medium text-steel-600">{product.category.name}</p>}
        <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900 group-hover:text-brand-600">{product.name}</h3>
        {product.summary && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.summary}</p>}
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="text-sm font-bold text-brand-600">{product.price || "Liên hệ báo giá"}</p>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-brand-600 group-hover:text-white">
            <Icon name="arrow" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

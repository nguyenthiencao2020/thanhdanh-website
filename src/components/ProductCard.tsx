import Link from "next/link";
import type { ProductWithRelations } from "@/lib/types";
import { Icon } from "./Icon";

export function ProductImage({ product, className = "" }: { product: ProductWithRelations; className?: string }) {
  if (product.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.image_url} alt={product.name} loading="lazy" className={`h-full w-full object-contain ${className}`} />;
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
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-md"
    >
      <div className="aspect-[4/3] bg-white p-3">
        <ProductImage product={product} className="rounded" />
      </div>
      <div className="flex flex-1 flex-col border-t border-slate-100 p-4">
        {product.category && <p className="text-xs font-medium text-steel-600">{product.category.name}</p>}
        <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900 group-hover:text-brand-600">{product.name}</h3>
        {product.summary && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.summary}</p>}
        <p className="mt-auto pt-3 text-sm font-bold text-brand-600">{product.price || "Liên hệ báo giá"}</p>
      </div>
    </Link>
  );
}

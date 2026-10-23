import type { Brand } from "@/lib/types";

export function BrandLogo({
  brand,
  className = "h-12",
  eager,
}: {
  brand: Pick<Brand, "name" | "logo_url">;
  className?: string;
  eager?: boolean;
}) {
  if (brand.logo_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={brand.logo_url} alt={brand.name} loading={eager ? "eager" : "lazy"} className={`w-auto max-w-full object-contain ${className}`} />;
  }
  return (
    <span className={`flex items-center text-xl font-extrabold tracking-wide text-slate-700 uppercase ${className}`}>{brand.name}</span>
  );
}

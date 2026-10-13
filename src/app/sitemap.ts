import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = await getProducts();
  return [
    ...["", "/san-pham", "/thuong-hieu", "/gioi-thieu", "/lien-he"].map((p) => ({ url: `${base}${p}` })),
    ...products.map((p) => ({ url: `${base}/san-pham/${p.slug}` })),
  ];
}

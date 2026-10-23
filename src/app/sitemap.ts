import type { MetadataRoute } from "next";
import { getCategories, getPages, getPosts, getProducts } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [products, categories, posts, pages] = await Promise.all([getProducts(), getCategories(), getPosts(), getPages()]);
  return [
    ...["", "/gioi-thieu", "/san-pham", "/thuong-hieu", "/dich-vu", "/tin-tuc", "/lien-he"].map((p) => ({ url: `${base}${p}` })),
    ...categories.map((c) => ({ url: `${base}/danh-muc-san-pham/${c.slug}` })),
    ...products.map((p) => ({ url: `${base}/san-pham/${p.slug}` })),
    ...posts.map((p) => ({ url: `${base}/tin-tuc/${p.slug}`, lastModified: p.published_at })),
    ...pages.map((p) => ({ url: `${base}/${p.slug}` })),
  ];
}

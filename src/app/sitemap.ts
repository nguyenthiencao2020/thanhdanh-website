import type { MetadataRoute } from "next";
import { countByCategory, nonEmptyTree } from "@/lib/catalog";
import { getCategoryTree, getPages, getPosts, getProductPairs, getProducts } from "@/lib/data";
import { siteUrl } from "@/lib/utils";
import { brandHref, getBrandsWithLines, lineHref } from "@/lib/lines";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl;
  const [products, tree, pairs, posts, pages] = await Promise.all([getProducts(), getCategoryTree(), getProductPairs(), getPosts(), getPages()]);
  // Only categories that have products (empty ones are hidden on the site).
  const categories = nonEmptyTree(tree, countByCategory(tree, pairs)).flatMap((g) => [g, ...g.children]);
  const brandLines = await getBrandsWithLines();
  return [
    ...["", "/gioi-thieu", "/san-pham", "/thuong-hieu", "/dich-vu", "/tin-tuc", "/lien-he"].map((p) => ({ url: `${base}${p}` })),
    ...categories.map((c) => ({ url: `${base}/danh-muc-san-pham/${c.slug}` })),
    ...products.map((p) => ({ url: `${base}/san-pham/${p.slug}` })),
    ...brandLines.map((b) => ({ url: `${base}${brandHref(b.brand.slug)}` })),
    ...brandLines.flatMap((b) => b.lines.map((l) => ({ url: `${base}${lineHref(l)}` }))),
    ...posts.map((p) => ({ url: `${base}/tin-tuc/${p.slug}`, lastModified: p.published_at })),
    ...pages.map((p) => ({ url: `${base}/${p.slug}` })),
  ];
}

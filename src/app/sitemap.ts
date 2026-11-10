import type { MetadataRoute } from "next";
import { countByCategory, nonEmptyTree } from "@/lib/catalog";
import { getBrands, getCategoryTree, getPages, getPosts, getProductPairs, getProducts } from "@/lib/data";
import { siteUrl } from "@/lib/utils";
import { brandHref, getBrandsWithLines, lineHref } from "@/lib/lines";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl;
  const [products, tree, pairs, posts, pages] = await Promise.all([getProducts(), getCategoryTree(), getProductPairs(), getPosts(), getPages()]);
  // Only categories that have products (empty ones are hidden on the site).
  const categories = nonEmptyTree(tree, countByCategory(tree, pairs)).flatMap((g) => [g, ...g.children]);
  const [brandLines, allBrands] = await Promise.all([getBrandsWithLines(), getBrands()]);
  // Every brand page: brands with product lines, plus the ones supplied on request.
  const brandSlugs = [...new Set([...brandLines.map((b) => b.brand.slug), ...allBrands.map((b) => b.slug)])];
  return [
    ...["", "/gioi-thieu", "/san-pham", "/thuong-hieu", "/dich-vu", "/tin-tuc", "/lien-he"].map((p) => ({ url: `${base}${p}` })),
    ...categories.map((c) => ({ url: `${base}/danh-muc-san-pham/${c.slug}` })),
    ...products.map((p) => ({ url: `${base}/san-pham/${p.slug}` })),
    ...brandSlugs.map((slug) => ({ url: `${base}${brandHref(slug)}` })),
    ...brandLines.flatMap((b) => b.lines.map((l) => ({ url: `${base}${lineHref(l)}` }))),
    ...posts.map((p) => ({ url: `${base}/tin-tuc/${p.slug}`, lastModified: p.published_at })),
    ...pages.map((p) => ({ url: `${base}/${p.slug}` })),
  ];
}

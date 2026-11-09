import "server-only";
import data from "@/data/product-lines.json";
import { featuredBrands } from "./catalog";
import { foldAccents, getBrands } from "./data";
import type { Brand } from "./types";

/**
 * Product lines ("dòng hàng"): what Đạt Danh sells, per brand — one representative photo per line
 * and the series as text, instead of one page per part number. Draft data: src/data/product-lines.json
 * (from tai-lieu/Dong-hang-theo-hang-NHAP.xlsx).
 */
export type ProductLine = {
  brand: string;
  slug: string;
  name: string;
  /** Product group (category slug) for the "by type" filter. */
  group: string;
  series: string[];
  image_url: string | null;
  description: string;
  /** Old product slugs this line replaces. */
  products: string[];
  sort_order: number;
};

export type LineBrand = Pick<Brand, "slug" | "name" | "logo_url"> & { featured?: boolean | null };
export type BrandWithLines = { brand: LineBrand; lines: ProductLine[] };

/** Lines sold without a single brand (pushbuttons, capacitors…). */
export const GENERIC_BRAND: LineBrand = { slug: "hang-thong-dung", name: "Hàng thông dụng", logo_url: null };

const LINES = (data as ProductLine[]).slice().sort((a, b) => a.sort_order - b.sort_order);

export function getLines(): ProductLine[] {
  return LINES;
}

/** Brands that have lines, featured brands first, then by number of lines; generic lines last. */
export async function getBrandsWithLines(): Promise<BrandWithLines[]> {
  const brands = await getBrands();
  const top = featuredBrands(brands).map((b) => b.slug);
  const bySlug = new Map(brands.map((b) => [b.slug, b]));
  const groups = new Map<string, ProductLine[]>();
  for (const l of LINES) groups.set(l.brand, [...(groups.get(l.brand) ?? []), l]);
  const list: BrandWithLines[] = [];
  for (const [slug, lines] of groups) {
    const brand = slug === GENERIC_BRAND.slug ? GENERIC_BRAND : bySlug.get(slug);
    if (brand) list.push({ brand, lines });
  }
  const rank = (s: string) => (s === GENERIC_BRAND.slug ? 999 : top.includes(s) ? top.indexOf(s) : 100);
  return list.sort((a, b) => rank(a.brand.slug) - rank(b.brand.slug) || b.lines.length - a.lines.length);
}

/** Lines matching a search (name, series, brand, with or without accents). */
export function searchLines(q: string, brandName: (slug: string) => string) {
  const needle = foldAccents(q.trim());
  if (!needle) return [];
  return LINES.filter((l) => foldAccents([l.name, l.series.join(" "), brandName(l.brand)].join(" ")).includes(needle));
}

export const lineHref = (l: Pick<ProductLine, "brand" | "slug">) => `/thuong-hieu/${l.brand}/${l.slug}`;
export const brandHref = (slug: string) => `/thuong-hieu/${slug}`;

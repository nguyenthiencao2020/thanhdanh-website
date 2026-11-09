import type { Brand, CategoryNode } from "./types";

/** One published product reduced to where it is filed: its category slug and brand slug. */
export type ProductPair = { category: string | null; brand: string | null };

/** Shown as “Hãng chủ lực” until brands are ticked in Admin (migration 0011). */
export const DEFAULT_FEATURED_BRANDS = ["siemens", "schneider-electric", "abb", "ifm", "autonics", "chint", "weidmuller", "sick"];

/** Up to `limit` brands to lead with: the ones ticked in Admin, else the default list. */
export function featuredBrands(brands: Brand[], limit = 8): Brand[] {
  const ticked = brands.filter((b) => b.featured);
  const list = ticked.length ? ticked : DEFAULT_FEATURED_BRANDS.map((s) => brands.find((b) => b.slug === s)).filter((b): b is Brand => !!b);
  return list.slice(0, limit);
}

/** Product count per brand slug. */
export function countByBrand(pairs: ProductPair[]) {
  const m = new Map<string, number>();
  for (const p of pairs) if (p.brand) m.set(p.brand, (m.get(p.brand) ?? 0) + 1);
  return m;
}

/** Product count per category slug; a group counts its own products plus its sub-categories'. */
export function countByCategory(tree: CategoryNode[], pairs: ProductPair[]) {
  const direct = new Map<string, number>();
  for (const p of pairs) if (p.category) direct.set(p.category, (direct.get(p.category) ?? 0) + 1);
  const m = new Map(direct);
  for (const g of tree) m.set(g.slug, (direct.get(g.slug) ?? 0) + g.children.reduce((n, c) => n + (direct.get(c.slug) ?? 0), 0));
  return m;
}

/** The tree without empty groups and empty sub-categories (they come back as soon as a product is added). */
export function nonEmptyTree(tree: CategoryNode[], counts: Map<string, number>): CategoryNode[] {
  return tree
    .filter((g) => (counts.get(g.slug) ?? 0) > 0)
    .map((g) => ({ ...g, children: g.children.filter((c) => (counts.get(c.slug) ?? 0) > 0) }));
}

/** Slug of the group each category belongs to (a group maps to itself). */
export function groupIndex(tree: CategoryNode[]) {
  const m = new Map<string, string>();
  for (const g of tree) {
    m.set(g.slug, g.slug);
    g.children.forEach((c) => m.set(c.slug, g.slug));
  }
  return m;
}

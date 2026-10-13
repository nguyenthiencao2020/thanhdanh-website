import "server-only";
import catalog from "@/data/catalog.json";
import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/server";
import type { Brand, Category, ProductWithRelations, Settings } from "./types";

const PRODUCT_SELECT = "*, category:categories(slug,name), brand:brands(slug,name,logo_url)";

// ---------------------------------------------------------------------------
// Fallback content (used until Supabase env vars are configured)
// ---------------------------------------------------------------------------
const fallbackCategories: Category[] = catalog.categories.map((c) => ({ id: c.slug, ...c }));
const fallbackBrands: Brand[] = catalog.brands.map((b) => ({ id: b.slug, ...b }));
const fallbackProducts: ProductWithRelations[] = catalog.products.map((p) => {
  const category = fallbackCategories.find((c) => c.slug === p.category) ?? null;
  const brand = fallbackBrands.find((b) => b.slug === p.brand) ?? null;
  return {
    id: p.slug,
    slug: p.slug,
    name: p.name,
    sku: null,
    category_id: category?.id ?? null,
    brand_id: brand?.id ?? null,
    summary: p.summary,
    description: p.description,
    image_url: p.image_url,
    price: null,
    featured: p.featured,
    published: true,
    category: category && { slug: category.slug, name: category.name },
    brand: brand && { slug: brand.slug, name: brand.name, logo_url: brand.logo_url },
  };
});

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured) return catalog.settings;
  const { data, error } = await createPublicClient().from("settings").select("*").eq("id", 1).maybeSingle();
  if (error) console.error("getSettings", error.message);
  return data ?? catalog.settings;
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return fallbackCategories;
  const { data, error } = await createPublicClient().from("categories").select("*").order("sort_order").order("name");
  if (error) console.error("getCategories", error.message);
  return data ?? [];
}

export async function getBrands(): Promise<Brand[]> {
  if (!isSupabaseConfigured) return fallbackBrands;
  const { data, error } = await createPublicClient().from("brands").select("*").order("sort_order").order("name");
  if (error) console.error("getBrands", error.message);
  return data ?? [];
}

export type ProductFilter = {
  category?: string;
  brand?: string;
  q?: string;
  featured?: boolean;
  limit?: number;
};

/** Strips characters that have meaning in PostgREST filter syntax. */
function cleanSearch(q: string) {
  return q.replace(/[%_,.()*\\:"']/g, " ").trim().slice(0, 80);
}

export async function getProducts(filter: ProductFilter = {}): Promise<ProductWithRelations[]> {
  const q = filter.q ? cleanSearch(filter.q) : "";

  if (!isSupabaseConfigured) {
    let list = fallbackProducts;
    if (filter.category) list = list.filter((p) => p.category?.slug === filter.category);
    if (filter.brand) list = list.filter((p) => p.brand?.slug === filter.brand);
    if (filter.featured) list = list.filter((p) => p.featured);
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter((p) => `${p.name} ${p.summary ?? ""}`.toLowerCase().includes(needle));
    }
    return filter.limit ? list.slice(0, filter.limit) : list;
  }

  const supabase = createPublicClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("published", true);

  if (filter.category) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", filter.category).maybeSingle();
    if (!cat) return [];
    query = query.eq("category_id", cat.id);
  }
  if (filter.brand) {
    const { data: brand } = await supabase.from("brands").select("id").eq("slug", filter.brand).maybeSingle();
    if (!brand) return [];
    query = query.eq("brand_id", brand.id);
  }
  if (filter.featured) query = query.eq("featured", true);
  if (q) query = query.or(`name.ilike.%${q}%,summary.ilike.%${q}%,sku.ilike.%${q}%`);

  query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });
  if (filter.limit) query = query.limit(filter.limit);

  const { data, error } = await query;
  if (error) console.error("getProducts", error.message);
  return (data as ProductWithRelations[] | null) ?? [];
}

export async function getProduct(slug: string): Promise<ProductWithRelations | null> {
  if (!isSupabaseConfigured) return fallbackProducts.find((p) => p.slug === slug) ?? null;
  const { data, error } = await createPublicClient()
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) console.error("getProduct", error.message);
  return (data as ProductWithRelations | null) ?? null;
}

import "server-only";
import catalog from "@/data/catalog.json";
import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/server";
import type { Brand, Category, Page, Post, ProductWithRelations, Service, Settings } from "./types";

const PRODUCT_SELECT = "*, category:categories(slug,name), brand:brands(slug,name,logo_url)";

// ---------------------------------------------------------------------------
// Fallback content (used until Supabase env vars are configured)
// ---------------------------------------------------------------------------
const fallbackSettings = catalog.settings as Settings;
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
    specs: p.specs ?? null,
    image_url: p.image_url,
    gallery: [],
    datasheet_url: null,
    in_stock: true,
    price: null,
    featured: p.featured,
    published: true,
    category: category && { slug: category.slug, name: category.name },
    brand: brand && { slug: brand.slug, name: brand.name, logo_url: brand.logo_url },
  };
});
const fallbackPosts: Post[] = catalog.posts.map((p) => ({ id: p.slug, published: true, ...p }));
const fallbackServices: Service[] = catalog.services.map((s) => ({ id: s.slug, ...s }));
const fallbackPages: Page[] = catalog.pages.map((p) => ({ id: p.slug, ...p }));

/** Strips characters that have meaning in PostgREST filter syntax. */
function cleanSearch(q: string) {
  return q.replace(/[%_,.()*\\:"'{}]/g, " ").trim().slice(0, 80);
}

const includes = (hay: (string | null | undefined)[], needle: string) =>
  hay.join(" ").toLowerCase().includes(needle.toLowerCase());

// ---------------------------------------------------------------------------
// Settings, categories, brands
// ---------------------------------------------------------------------------
export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured) return fallbackSettings;
  const { data, error } = await createPublicClient().from("settings").select("*").eq("id", 1).maybeSingle();
  if (error) console.error("getSettings", error.message);
  return data ?? fallbackSettings;
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

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export const PRODUCT_SORTS = {
  "noi-bat": "Nổi bật",
  "moi-nhat": "Mới nhất",
  "ten-a-z": "Tên A → Z",
} as const;
export type ProductSort = keyof typeof PRODUCT_SORTS;

export type ProductFilter = {
  category?: string;
  brand?: string;
  q?: string;
  featured?: boolean;
  sort?: ProductSort;
  limit?: number;
  /** 1-based page number; used with pageSize */
  page?: number;
  pageSize?: number;
};

export type Paged<T> = { items: T[]; total: number };

export async function getProductsPage(filter: ProductFilter = {}): Promise<Paged<ProductWithRelations>> {
  const q = filter.q ? cleanSearch(filter.q) : "";
  const sort = filter.sort ?? "noi-bat";
  const pageSize = filter.pageSize ?? filter.limit;
  const from = pageSize ? ((filter.page ?? 1) - 1) * pageSize : 0;

  if (!isSupabaseConfigured) {
    let list = fallbackProducts;
    if (filter.category) list = list.filter((p) => p.category?.slug === filter.category);
    if (filter.brand) list = list.filter((p) => p.brand?.slug === filter.brand);
    if (filter.featured) list = list.filter((p) => p.featured);
    if (q) list = list.filter((p) => includes([p.name, p.summary, p.sku], q));
    if (sort === "ten-a-z") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "vi"));
    if (sort === "noi-bat") list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    return { items: pageSize ? list.slice(from, from + pageSize) : list, total: list.length };
  }

  const supabase = createPublicClient();
  let query = supabase.from("products").select(PRODUCT_SELECT, { count: "exact" }).eq("published", true);

  if (filter.category) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", filter.category).maybeSingle();
    if (!cat) return { items: [], total: 0 };
    query = query.eq("category_id", cat.id);
  }
  if (filter.brand) {
    const { data: brand } = await supabase.from("brands").select("id").eq("slug", filter.brand).maybeSingle();
    if (!brand) return { items: [], total: 0 };
    query = query.eq("brand_id", brand.id);
  }
  if (filter.featured) query = query.eq("featured", true);
  if (q) query = query.or(`name.ilike.%${q}%,summary.ilike.%${q}%,sku.ilike.%${q}%`);

  if (sort === "ten-a-z") query = query.order("name");
  else if (sort === "moi-nhat") query = query.order("created_at", { ascending: false });
  else query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });

  if (pageSize) query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) console.error("getProductsPage", error.message);
  return { items: (data as ProductWithRelations[] | null) ?? [], total: count ?? 0 };
}

export async function getProducts(filter: ProductFilter = {}): Promise<ProductWithRelations[]> {
  return (await getProductsPage(filter)).items;
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

// ---------------------------------------------------------------------------
// News / blog
// ---------------------------------------------------------------------------
export type PostFilter = { category?: string; tag?: string; q?: string; page?: number; pageSize?: number; limit?: number };

export async function getPostsPage(filter: PostFilter = {}): Promise<Paged<Post>> {
  const q = filter.q ? cleanSearch(filter.q) : "";
  const pageSize = filter.pageSize ?? filter.limit;
  const from = pageSize ? ((filter.page ?? 1) - 1) * pageSize : 0;

  if (!isSupabaseConfigured) {
    let list = [...fallbackPosts].sort((a, b) => b.published_at.localeCompare(a.published_at));
    if (filter.category) list = list.filter((p) => p.category === filter.category);
    if (filter.tag) list = list.filter((p) => p.tags?.includes(filter.tag!));
    if (q) list = list.filter((p) => includes([p.title, p.excerpt], q));
    return { items: pageSize ? list.slice(from, from + pageSize) : list, total: list.length };
  }

  let query = createPublicClient()
    .from("posts")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (filter.category) query = query.eq("category", filter.category);
  if (filter.tag) query = query.contains("tags", [filter.tag]);
  if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
  if (pageSize) query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) console.error("getPostsPage", error.message);
  return { items: data ?? [], total: count ?? 0 };
}

export async function getPosts(filter: PostFilter = {}): Promise<Post[]> {
  return (await getPostsPage(filter)).items;
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured) return fallbackPosts.find((p) => p.slug === slug) ?? null;
  const { data, error } = await createPublicClient().from("posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) console.error("getPost", error.message);
  return data ?? null;
}

/** Categories and tags with post counts, for the news sidebar. */
export async function getPostFacets() {
  let rows: Pick<Post, "category" | "tags">[] = fallbackPosts;
  if (isSupabaseConfigured) {
    const { data, error } = await createPublicClient().from("posts").select("category, tags").eq("published", true);
    if (error) console.error("getPostFacets", error.message);
    rows = data ?? [];
  }
  const count = (values: (string | null | undefined)[]) => {
    const m = new Map<string, number>();
    values.forEach((v) => v && m.set(v, (m.get(v) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, count: n }));
  };
  return { categories: count(rows.map((r) => r.category)), tags: count(rows.flatMap((r) => r.tags ?? [])) };
}

// ---------------------------------------------------------------------------
// Services & policy pages
// ---------------------------------------------------------------------------
export async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured) return fallbackServices;
  const { data, error } = await createPublicClient().from("services").select("*").order("sort_order").order("title");
  if (error) console.error("getServices", error.message);
  return data ?? [];
}

export async function getPages(): Promise<Page[]> {
  if (!isSupabaseConfigured) return fallbackPages;
  const { data, error } = await createPublicClient().from("pages").select("*").order("sort_order").order("title");
  if (error) console.error("getPages", error.message);
  return data ?? [];
}

export async function getPage(slug: string): Promise<Page | null> {
  if (!isSupabaseConfigured) return fallbackPages.find((p) => p.slug === slug) ?? null;
  const { data, error } = await createPublicClient().from("pages").select("*").eq("slug", slug).maybeSingle();
  if (error) console.error("getPage", error.message);
  return data ?? null;
}

import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./supabase/config";
import { createSessionClient } from "./supabase/server";

/**
 * Returns a Supabase client acting as the signed-in admin, or redirects.
 * Every admin page and server action calls this — RLS enforces the same rule in the database.
 */
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect("/admin/login");
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login?error=session");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=forbidden");

  return { supabase, user };
}

/**
 * Published products per category id and per brand id, so Admin can show which ones the website
 * hides (groups, sub-categories and brands without products are hidden on the public pages).
 */
export async function getAdminProductCounts(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"]) {
  const { data } = await supabase.from("products").select("category_id, brand_id").eq("published", true).range(0, 9999);
  const byCategory = new Map<string, number>();
  const byBrand = new Map<string, number>();
  for (const p of (data ?? []) as { category_id: string | null; brand_id: string | null }[]) {
    if (p.category_id) byCategory.set(p.category_id, (byCategory.get(p.category_id) ?? 0) + 1);
    if (p.brand_id) byBrand.set(p.brand_id, (byBrand.get(p.brand_id) ?? 0) + 1);
  }
  return { byCategory, byBrand };
}

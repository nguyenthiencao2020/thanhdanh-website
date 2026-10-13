"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

const text = (form: FormData, key: string) => {
  const v = String(form.get(key) ?? "").trim();
  return v === "" ? null : v;
};
const int = (form: FormData, key: string) => Number.parseInt(String(form.get(key) ?? "0"), 10) || 0;
const bool = (form: FormData, key: string) => form.get(key) === "on";

/** Public pages are cached (ISR) — refresh them after any content change. */
function refreshSite() {
  revalidatePath("/", "layout");
}

const MAX_UPLOAD = 4 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

/** Uploads an image from the form to the `media` bucket and returns its public URL (or null if none chosen). */
async function uploadImage(supabase: Supabase, file: FormDataEntryValue | null, folder: string) {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Chỉ hỗ trợ ảnh JPG, PNG, WEBP, SVG hoặc GIF.");
  if (file.size > MAX_UPLOAD) throw new Error("Ảnh tối đa 4MB.");

  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) throw new Error(`Tải ảnh thất bại: ${error.message}`);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function fail(path: string, message: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}error=${encodeURIComponent(message)}`);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function signIn(form: FormData) {
  if (!isSupabaseConfigured) fail("/admin/login", "Chưa cấu hình Supabase.");
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? ""),
    password: String(form.get("password") ?? ""),
  });
  if (error) fail("/admin/login", "Email hoặc mật khẩu không đúng.");
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export async function saveProduct(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const back = id ? `/admin/san-pham/${id}` : "/admin/san-pham/moi";

  const name = text(form, "name");
  if (!name) fail(back, "Vui lòng nhập tên sản phẩm.");

  let imageUrl = text(form, "image_url");
  try {
    imageUrl = (await uploadImage(supabase, form.get("image"), "products")) ?? imageUrl;
  } catch (e) {
    fail(back, (e as Error).message);
  }
  if (bool(form, "remove_image")) imageUrl = null;

  const row = {
    name,
    slug: slugify(text(form, "slug") ?? name) || crypto.randomUUID().slice(0, 8),
    sku: text(form, "sku"),
    category_id: text(form, "category_id"),
    brand_id: text(form, "brand_id"),
    summary: text(form, "summary"),
    description: text(form, "description"),
    price: text(form, "price"),
    image_url: imageUrl,
    featured: bool(form, "featured"),
    published: bool(form, "published"),
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("products").update(row).eq("id", id)
    : await supabase.from("products").insert(row);
  if (error) fail(back, error.code === "23505" ? "Đường dẫn (slug) đã tồn tại." : error.message);

  refreshSite();
  redirect("/admin/san-pham?saved=1");
}

export async function deleteProduct(form: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", String(form.get("id")));
  if (error) fail("/admin/san-pham", error.message);
  refreshSite();
  redirect("/admin/san-pham");
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export async function saveCategory(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const name = text(form, "name");
  if (!name) fail("/admin/danh-muc", "Vui lòng nhập tên danh mục.");

  const row = {
    name,
    slug: slugify(text(form, "slug") ?? name),
    description: text(form, "description"),
    icon: text(form, "icon"),
    sort_order: int(form, "sort_order"),
  };
  const { error } = id
    ? await supabase.from("categories").update(row).eq("id", id)
    : await supabase.from("categories").insert(row);
  if (error) fail("/admin/danh-muc", error.code === "23505" ? "Đường dẫn (slug) đã tồn tại." : error.message);

  refreshSite();
  redirect("/admin/danh-muc?saved=1");
}

export async function deleteCategory(form: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", String(form.get("id")));
  if (error) fail("/admin/danh-muc", error.message);
  refreshSite();
  redirect("/admin/danh-muc");
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------
export async function saveBrand(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const name = text(form, "name");
  if (!name) fail("/admin/thuong-hieu", "Vui lòng nhập tên thương hiệu.");

  let logoUrl = text(form, "logo_url");
  try {
    logoUrl = (await uploadImage(supabase, form.get("logo"), "brands")) ?? logoUrl;
  } catch (e) {
    fail("/admin/thuong-hieu", (e as Error).message);
  }

  const row = { name, slug: slugify(text(form, "slug") ?? name), logo_url: logoUrl, sort_order: int(form, "sort_order") };
  const { error } = id
    ? await supabase.from("brands").update(row).eq("id", id)
    : await supabase.from("brands").insert(row);
  if (error) fail("/admin/thuong-hieu", error.code === "23505" ? "Đường dẫn (slug) đã tồn tại." : error.message);

  refreshSite();
  redirect("/admin/thuong-hieu?saved=1");
}

export async function deleteBrand(form: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("brands").delete().eq("id", String(form.get("id")));
  if (error) fail("/admin/thuong-hieu", error.message);
  refreshSite();
  redirect("/admin/thuong-hieu");
}

// ---------------------------------------------------------------------------
// Inquiries
// ---------------------------------------------------------------------------
export async function toggleInquiry(form: FormData) {
  const { supabase } = await requireAdmin();
  await supabase
    .from("inquiries")
    .update({ handled: form.get("handled") === "true" })
    .eq("id", String(form.get("id")));
  revalidatePath("/admin", "layout");
}

export async function deleteInquiry(form: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("inquiries").delete().eq("id", String(form.get("id")));
  revalidatePath("/admin", "layout");
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export async function saveSettings(form: FormData) {
  const { supabase } = await requireAdmin();
  const companyName = text(form, "company_name");
  const shortName = text(form, "short_name");
  if (!companyName || !shortName) fail("/admin/cai-dat", "Tên công ty và tên ngắn là bắt buộc.");
  const mapUrl = text(form, "map_embed_url");
  if (mapUrl && !/^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(mapUrl)) {
    fail("/admin/cai-dat", "Link bản đồ phải là link nhúng Google Maps (https://www.google.com/maps/...).");
  }

  const { error } = await supabase.from("settings").upsert({
    id: 1,
    company_name: companyName,
    short_name: shortName,
    tagline: text(form, "tagline"),
    about: text(form, "about"),
    phone: text(form, "phone"),
    phone2: text(form, "phone2"),
    email: text(form, "email"),
    address: text(form, "address"),
    zalo: text(form, "zalo"),
    facebook: text(form, "facebook"),
    map_embed_url: mapUrl,
    business_hours: text(form, "business_hours"),
    updated_at: new Date().toISOString(),
  });
  if (error) fail("/admin/cai-dat", error.message);

  refreshSite();
  redirect("/admin/cai-dat?saved=1");
}

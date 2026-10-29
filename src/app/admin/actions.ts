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

const PDF_TYPES: Record<string, string> = { "application/pdf": "pdf" };
// Vercel caps a request body at ~4.5MB, so files (and the whole form) must stay under that.
const MAX_PDF = 4 * 1024 * 1024;

/** Uploads an image from the form to the `media` bucket and returns its public URL (or null if none chosen). */
async function uploadImage(supabase: Supabase, file: FormDataEntryValue | null, folder: string) {
  return uploadFile(supabase, file, folder, IMAGE_TYPES, MAX_UPLOAD, "Chỉ hỗ trợ ảnh JPG, PNG, WEBP, SVG hoặc GIF.", "Ảnh tối đa 4MB.");
}

async function uploadFile(
  supabase: Supabase,
  file: FormDataEntryValue | null,
  folder: string,
  types: Record<string, string>,
  maxSize: number,
  typeError: string,
  sizeError: string,
) {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = types[file.type];
  if (!ext) throw new Error(typeError);
  if (file.size > maxSize) throw new Error(sizeError);

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
export type SignInState = { error?: string; ok?: boolean };

/** Used with useActionState: returns an error to show, or ok (the form then loads /admin). */
export async function signIn(_prev: SignInState, form: FormData): Promise<SignInState> {
  if (!isSupabaseConfigured) return { error: "Chưa cấu hình Supabase." };
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  });
  if (error) {
    if (error.code === "email_not_confirmed")
      return { error: "Email chưa được xác nhận. Trong Supabase → Authentication → Users, mở tài khoản này và bấm Confirm (hoặc tạo lại với “Auto Confirm User”)." };
    if (error.code === "invalid_credentials" || error.status === 400) return { error: "Email hoặc mật khẩu không đúng." };
    return { error: `Không đăng nhập được: ${error.message}` };
  }

  // Check the admin right away so an unauthorised account gets a clear message.
  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (rpcError) return { error: `Đăng nhập được nhưng không kiểm tra được quyền quản trị: ${rpcError.message}` };
  if (!isAdmin) {
    await supabase.auth.signOut();
    return {
      error: "Tài khoản này đăng nhập được nhưng chưa được cấp quyền quản trị. Chạy lệnh insert into public.admins … trong Supabase → SQL Editor rồi đăng nhập lại.",
    };
  }
  return { ok: true };
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

  // Extra gallery images: keep the ones still listed, append new uploads.
  const gallery = form.getAll("gallery_keep").map(String).filter(Boolean);
  let datasheetUrl = text(form, "datasheet_url");
  try {
    for (const f of form.getAll("gallery_new")) {
      const url = await uploadImage(supabase, f, "products");
      if (url) gallery.push(url);
    }
    datasheetUrl =
      (await uploadFile(supabase, form.get("datasheet"), "datasheets", PDF_TYPES, MAX_PDF, "Datasheet phải là file PDF.", "File PDF tối đa 4MB.")) ??
      datasheetUrl;
  } catch (e) {
    fail(back, (e as Error).message);
  }
  if (bool(form, "remove_datasheet")) datasheetUrl = null;

  const row = {
    name,
    slug: slugify(text(form, "slug") ?? name) || crypto.randomUUID().slice(0, 8),
    sku: text(form, "sku"),
    category_id: text(form, "category_id"),
    brand_id: text(form, "brand_id"),
    summary: text(form, "summary"),
    description: text(form, "description"),
    specs: text(form, "specs"),
    price: text(form, "price"),
    image_url: imageUrl,
    gallery: gallery.slice(0, 12),
    datasheet_url: datasheetUrl,
    in_stock: bool(form, "in_stock"),
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

  let imageUrl = text(form, "image_url");
  try {
    imageUrl = (await uploadImage(supabase, form.get("image"), "categories")) ?? imageUrl;
  } catch (e) {
    fail("/admin/danh-muc", (e as Error).message);
  }

  const row = {
    name,
    slug: slugify(text(form, "slug") ?? name),
    description: text(form, "description"),
    icon: text(form, "icon"),
    image_url: imageUrl,
    sort_order: int(form, "sort_order"),
    parent_id: text(form, "parent_id"),
  };
  // Categories are two levels deep: a parent must be a group, and a group with children can't be nested.
  if (row.parent_id) {
    if (row.parent_id === id) fail("/admin/danh-muc", "Danh mục không thể là cha của chính nó.");
    const { data: parent } = await supabase.from("categories").select("parent_id").eq("id", row.parent_id).maybeSingle();
    if (parent?.parent_id) fail("/admin/danh-muc", "Chỉ chọn được danh mục cha là nhóm cấp 1.");
    if (id) {
      const { count } = await supabase.from("categories").select("id", { count: "exact", head: true }).eq("parent_id", id);
      if (count) fail("/admin/danh-muc", "Nhóm này đang có danh mục con nên không thể đặt làm danh mục con.");
    }
  }
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
    english_name: text(form, "english_name"),
    tax_code: text(form, "tax_code"),
    license_info: text(form, "license_info"),
    tagline: text(form, "tagline"),
    about: text(form, "about"),
    phone: text(form, "phone"),
    phone2: text(form, "phone2"),
    email: text(form, "email"),
    address: text(form, "address"),
    zalo: text(form, "zalo"),
    facebook: text(form, "facebook"),
    map_embed_url: mapUrl,
    messenger_url: text(form, "messenger_url"),
    announcement: text(form, "announcement"),
    announcement_url: text(form, "announcement_url"),
    mission: text(form, "mission"),
    vision: text(form, "vision"),
    core_values: text(form, "core_values"),
    business_hours: text(form, "business_hours"),
    updated_at: new Date().toISOString(),
  });
  if (error) fail("/admin/cai-dat", error.message);

  refreshSite();
  redirect("/admin/cai-dat?saved=1");
}

// ---------------------------------------------------------------------------
// News posts
// ---------------------------------------------------------------------------
export async function savePost(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const back = id ? `/admin/tin-tuc/${id}` : "/admin/tin-tuc/moi";
  const title = text(form, "title");
  if (!title) fail(back, "Vui lòng nhập tiêu đề.");

  let coverUrl = text(form, "cover_url");
  try {
    coverUrl = (await uploadImage(supabase, form.get("cover"), "posts")) ?? coverUrl;
  } catch (e) {
    fail(back, (e as Error).message);
  }
  if (bool(form, "remove_cover")) coverUrl = null;

  const date = text(form, "published_at");
  const row = {
    title,
    slug: slugify(text(form, "slug") ?? title) || crypto.randomUUID().slice(0, 8),
    excerpt: text(form, "excerpt"),
    content: text(form, "content"),
    cover_url: coverUrl,
    category: text(form, "category"),
    tags: (text(form, "tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 12),
    author: text(form, "author"),
    featured: bool(form, "featured"),
    published: bool(form, "published"),
    ...(date ? { published_at: new Date(`${date}T08:00:00+07:00`).toISOString() } : {}),
    updated_at: new Date().toISOString(),
  };
  const { error } = id ? await supabase.from("posts").update(row).eq("id", id) : await supabase.from("posts").insert(row);
  if (error) fail(back, error.code === "23505" ? "Đường dẫn (slug) đã tồn tại." : error.message);

  refreshSite();
  redirect("/admin/tin-tuc?saved=1");
}

export async function deletePost(form: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("posts").delete().eq("id", String(form.get("id")));
  if (error) fail("/admin/tin-tuc", error.message);
  refreshSite();
  redirect("/admin/tin-tuc");
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export async function saveService(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const title = text(form, "title");
  if (!title) fail("/admin/dich-vu", "Vui lòng nhập tên dịch vụ.");
  const row = {
    title,
    slug: slugify(text(form, "slug") ?? title),
    summary: text(form, "summary"),
    content: text(form, "content"),
    icon: text(form, "icon"),
    sort_order: int(form, "sort_order"),
  };
  const { error } = id ? await supabase.from("services").update(row).eq("id", id) : await supabase.from("services").insert(row);
  if (error) fail("/admin/dich-vu", error.code === "23505" ? "Đường dẫn (slug) đã tồn tại." : error.message);
  refreshSite();
  redirect("/admin/dich-vu?saved=1");
}

export async function deleteService(form: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("services").delete().eq("id", String(form.get("id")));
  if (error) fail("/admin/dich-vu", error.message);
  refreshSite();
  redirect("/admin/dich-vu");
}

// ---------------------------------------------------------------------------
// Policy / static pages
// ---------------------------------------------------------------------------
/** Paths used by the site itself; a page with one of these slugs would never be reachable. */
const RESERVED_SLUGS = new Set(["admin", "api", "san-pham", "danh-muc-san-pham", "thuong-hieu", "gioi-thieu", "dich-vu", "tin-tuc", "lien-he", "tim-kiem"]);

export async function savePage(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const title = text(form, "title");
  if (!title) fail("/admin/trang", "Vui lòng nhập tiêu đề trang.");
  const slug = slugify(text(form, "slug") ?? title);
  if (RESERVED_SLUGS.has(slug)) fail("/admin/trang", `Đường dẫn “${slug}” đã được website sử dụng, hãy chọn tên khác.`);
  const row = { title, slug, content: text(form, "content"), sort_order: int(form, "sort_order"), updated_at: new Date().toISOString() };
  const { error } = id ? await supabase.from("pages").update(row).eq("id", id) : await supabase.from("pages").insert(row);
  if (error) fail("/admin/trang", error.code === "23505" ? "Đường dẫn (slug) đã tồn tại." : error.message);
  refreshSite();
  redirect("/admin/trang?saved=1");
}

export async function deletePage(form: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("pages").delete().eq("id", String(form.get("id")));
  if (error) fail("/admin/trang", error.message);
  refreshSite();
  redirect("/admin/trang");
}

// ---------------------------------------------------------------------------
// Home hero banners
// ---------------------------------------------------------------------------
export async function saveBanner(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const title = text(form, "title");
  if (!title) fail("/admin/banner", "Vui lòng nhập tiêu đề banner.");

  let imageUrl = text(form, "image_url");
  try {
    imageUrl = (await uploadImage(supabase, form.get("image"), "banners")) ?? imageUrl;
  } catch (e) {
    fail("/admin/banner", (e as Error).message);
  }
  if (bool(form, "remove_image")) imageUrl = null;

  const row = {
    title,
    subtitle: text(form, "subtitle"),
    image_url: imageUrl,
    cta_label: text(form, "cta_label"),
    cta_url: text(form, "cta_url"),
    sort_order: int(form, "sort_order"),
    published: bool(form, "published"),
  };
  const { error } = id ? await supabase.from("banners").update(row).eq("id", id) : await supabase.from("banners").insert(row);
  if (error) fail("/admin/banner", error.code === "23505" ? "Đã có banner trùng tiêu đề." : error.message);
  refreshSite();
  redirect("/admin/banner?saved=1");
}

export async function deleteBanner(form: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("banners").delete().eq("id", String(form.get("id")));
  if (error) fail("/admin/banner", error.message);
  refreshSite();
  redirect("/admin/banner");
}

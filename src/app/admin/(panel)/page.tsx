import Link from "next/link";
import { getAdminProductCounts, requireAdmin } from "@/lib/admin";

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const head = { count: "exact", head: true } as const;
  const [products, categories, brands, openInquiries] = (
    await Promise.all([
      supabase.from("products").select("*", head),
      supabase.from("categories").select("*", head),
      supabase.from("brands").select("*", head),
      supabase.from("inquiries").select("*", head).eq("handled", false),
    ])
  ).map((r) => r.count ?? 0);
  // What the public site actually shows: items without products are hidden there.
  const counts = await getAdminProductCounts(supabase);
  const { data: cats } = await supabase.from("categories").select("id, parent_id");
  const catRows = (cats ?? []) as { id: string; parent_id: string | null }[];
  const shownCats = catRows.filter((c) => (counts.byCategory.get(c.id) ?? 0) + catRows.filter((x) => x.parent_id === c.id).reduce((n, x) => n + (counts.byCategory.get(x.id) ?? 0), 0) > 0).length;

  const stats = [
    { label: "Yêu cầu chưa xử lý", value: openInquiries, href: "/admin/yeu-cau", accent: openInquiries > 0 },
    { label: "Sản phẩm", value: products, href: "/admin/san-pham" },
    { label: "Danh mục", value: categories, href: "/admin/danh-muc", note: `${shownCats} đang hiện trên web` },
    { label: "Thương hiệu", value: brands, href: "/admin/thuong-hieu", note: `${counts.byBrand.size} đang hiện trên web` },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-steel-500">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.accent ? "text-brand-600" : "text-slate-900"}`}>{s.value}</p>
            {"note" in s && s.note && <p className="mt-1 text-xs text-slate-500">{s.note}</p>}
          </Link>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/san-pham/moi" className="btn-primary">+ Thêm sản phẩm</Link>
        <Link href="/admin/cai-dat" className="btn-outline">Sửa thông tin công ty</Link>
      </div>
    </>
  );
}

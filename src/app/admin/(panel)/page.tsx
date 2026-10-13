import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

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

  const stats = [
    { label: "Yêu cầu chưa xử lý", value: openInquiries, href: "/admin/yeu-cau", accent: openInquiries > 0 },
    { label: "Sản phẩm", value: products, href: "/admin/san-pham" },
    { label: "Danh mục", value: categories, href: "/admin/danh-muc" },
    { label: "Thương hiệu", value: brands, href: "/admin/thuong-hieu" },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-steel-500">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.accent ? "text-brand-600" : "text-slate-900"}`}>{s.value}</p>
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

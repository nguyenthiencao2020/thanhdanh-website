import Link from "next/link";
import { deletePost } from "../../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Flash } from "@/components/admin/Flash";
import { requireAdmin } from "@/lib/admin";
import type { Post } from "@/lib/types";

export default async function AdminPosts({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("posts").select("*").order("published_at", { ascending: false });
  const posts = (data ?? []) as Post[];
  const fmt = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Tin tức ({posts.length})</h1>
        <Link href="/admin/tin-tuc/moi" className="btn-primary">+ Viết bài mới</Link>
      </div>
      <div className="mt-4"><Flash error={error} saved={saved} /></div>
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3">Bài viết</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Ngày đăng</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/tin-tuc/${p.id}`} className="font-semibold text-slate-900 hover:text-brand-600">{p.title}</Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{p.category ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">{fmt.format(new Date(p.published_at))}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${p.published ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {p.published ? "Hiển thị" : "Ẩn"}
                  </span>
                  {p.featured && <span className="ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Nổi bật</span>}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`/tin-tuc/${p.slug}`} target="_blank" className="mr-4 text-sm text-slate-500 hover:underline">Xem ↗</Link>
                  <Link href={`/admin/tin-tuc/${p.id}`} className="mr-4 text-sm font-medium text-steel-600 hover:underline">Sửa</Link>
                  <form action={deletePost} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton message={`Xóa bài “${p.title}”?`}>Xóa</ConfirmButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="p-6 text-center text-slate-500">Chưa có bài viết.</p>}
      </div>
    </>
  );
}

import Link from "next/link";
import { deleteProduct } from "../../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Flash } from "@/components/admin/Flash";
import { requireAdmin } from "@/lib/admin";
import type { ProductWithRelations } from "@/lib/types";

type SearchParams = Promise<{ error?: string; saved?: string; q?: string }>;

export default async function AdminProducts({ searchParams }: { searchParams: SearchParams }) {
  const { error, saved, q } = await searchParams;
  const { supabase } = await requireAdmin();
  let query = supabase
    .from("products")
    .select("*, category:categories(slug,name), brand:brands(slug,name,logo_url)")
    .order("created_at", { ascending: false });
  const term = q?.replace(/[%_,.()*\\:"']/g, " ").trim();
  if (term) query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%`);
  const { data } = await query;
  const products = (data ?? []) as ProductWithRelations[];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Sản phẩm ({products.length})</h1>
        <Link href="/admin/san-pham/moi" className="btn-primary">+ Thêm sản phẩm</Link>
      </div>
      <form className="mt-4 max-w-sm">
        <input name="q" type="search" defaultValue={q} placeholder="Tìm theo tên, mã…" className="input" />
      </form>
      <div className="mt-4"><Flash error={error} saved={saved} /></div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3">Sản phẩm</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Thương hiệu</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt="" className="h-10 w-10 rounded border border-slate-200 object-contain" />
                    ) : (
                      <span className="h-10 w-10 rounded bg-slate-100" />
                    )}
                    <div>
                      <Link href={`/admin/san-pham/${p.id}`} className="font-semibold text-slate-900 hover:text-brand-600">{p.name}</Link>
                      {p.sku && <p className="text-xs text-slate-500">{p.sku}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">{p.brand?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${p.published ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {p.published ? "Hiển thị" : "Ẩn"}
                  </span>
                  {p.featured && <span className="ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Nổi bật</span>}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/san-pham/${p.id}`} className="mr-4 text-sm font-medium text-steel-600 hover:underline">Sửa</Link>
                  <form action={deleteProduct} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton message={`Xóa sản phẩm “${p.name}”?`}>Xóa</ConfirmButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-6 text-center text-slate-500">Chưa có sản phẩm.</p>}
      </div>
    </>
  );
}

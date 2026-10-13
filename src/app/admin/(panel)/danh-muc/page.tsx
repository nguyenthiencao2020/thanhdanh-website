import { deleteCategory, saveCategory } from "../../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Flash } from "@/components/admin/Flash";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";

const ICONS = ["bolt", "cpu", "wind", "cog", "pipe", "box", "shield", "truck"];

function CategoryFields({ c }: { c?: Category }) {
  return (
    <>
      {c && <input type="hidden" name="id" value={c.id} />}
      <input type="hidden" name="image_url" value={c?.image_url ?? ""} />
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_120px_90px]">
        <input name="name" required defaultValue={c?.name} placeholder="Tên danh mục *" className="input" aria-label="Tên" />
        <input name="slug" defaultValue={c?.slug} placeholder="slug (tự tạo)" className="input" aria-label="Slug" />
        <select name="icon" defaultValue={c?.icon ?? "box"} className="input" aria-label="Biểu tượng">
          {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <input name="sort_order" type="number" defaultValue={c?.sort_order ?? 0} className="input" aria-label="Thứ tự" title="Thứ tự" />
      </div>
      <textarea name="description" rows={2} defaultValue={c?.description ?? ""} placeholder="Mô tả" className="input mt-3" aria-label="Mô tả" />
      <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
        {c?.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.image_url} alt="" className="h-12 w-16 rounded border border-slate-200 object-cover" />
        )}
        <label>
          Ảnh: <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="ml-2 text-sm" />
        </label>
      </div>
    </>
  );
}

export default async function AdminCategories({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  const categories = (data ?? []) as Category[];

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Danh mục</h1>
      <div className="mt-4"><Flash error={error} saved={saved} /></div>

      <form action={saveCategory} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="mb-3 font-semibold">Thêm danh mục</p>
        <CategoryFields />
        <button className="btn-primary mt-3">Thêm</button>
      </form>

      <div className="mt-6 space-y-3">
        {categories.map((c) => (
          <div key={c.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <form action={saveCategory}>
              <CategoryFields c={c} />
              <button className="btn-secondary mt-3">Lưu</button>
            </form>
            <form action={deleteCategory} className="mt-2">
              <input type="hidden" name="id" value={c.id} />
              <ConfirmButton message={`Xóa danh mục “${c.name}”? Sản phẩm thuộc danh mục sẽ không bị xóa.`}>Xóa danh mục</ConfirmButton>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}

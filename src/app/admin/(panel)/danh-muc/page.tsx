import { deleteCategory, saveCategory } from "../../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Flash } from "@/components/admin/Flash";
import { requireAdmin } from "@/lib/admin";
import { buildCategoryTree } from "@/lib/data";
import type { Category } from "@/lib/types";

const ICONS = ["bolt", "cpu", "wind", "cog", "pipe", "box", "shield", "truck", "clock", "search", "chat"];

function CategoryFields({ c, groups }: { c?: Category; groups: Category[] }) {
  return (
    <>
      {c && <input type="hidden" name="id" value={c.id} />}
      <input type="hidden" name="image_url" value={c?.image_url ?? ""} />
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_110px_80px]">
        <input name="name" required defaultValue={c?.name} placeholder="Tên danh mục *" className="input" aria-label="Tên" />
        <input name="slug" defaultValue={c?.slug} placeholder="slug (tự tạo)" className="input" aria-label="Slug" />
        <select name="parent_id" defaultValue={c?.parent_id ?? ""} className="input" aria-label="Danh mục cha">
          <option value="">— Nhóm cấp 1 —</option>
          {groups
            .filter((g) => g.id !== c?.id)
            .map((g) => (
              <option key={g.id} value={g.id}>Thuộc: {g.name}</option>
            ))}
        </select>
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

function CategoryCard({ c, groups, sub }: { c: Category; groups: Category[]; sub?: boolean }) {
  return (
    <details className={`rounded-xl bg-white shadow-sm ring-1 ring-slate-200 ${sub ? "ml-6" : ""}`}>
      <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-3">
        <span className={sub ? "text-sm text-slate-700" : "font-semibold text-slate-900"}>
          {sub ? "↳ " : ""}
          {c.name} <span className="text-xs font-normal text-slate-400">/{c.slug}</span>
        </span>
        <span className="text-xs text-steel-600">Sửa</span>
      </summary>
      <div className="border-t border-slate-100 p-5">
        <form action={saveCategory}>
          <CategoryFields c={c} groups={groups} />
          <button className="btn-secondary mt-3">Lưu</button>
        </form>
        <form action={deleteCategory} className="mt-2">
          <input type="hidden" name="id" value={c.id} />
          <ConfirmButton message={`Xóa danh mục “${c.name}”? Sản phẩm thuộc danh mục sẽ không bị xóa.`}>Xóa danh mục</ConfirmButton>
        </form>
      </div>
    </details>
  );
}

export default async function AdminCategories({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order").order("name");
  const categories = (data ?? []) as Category[];
  const tree = buildCategoryTree(categories);
  const groups = tree.map(({ children: _children, ...g }) => g);

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Danh mục</h1>
      <p className="mt-1 text-sm text-slate-500">
        {tree.length} nhóm · {categories.length - tree.length} danh mục con. Danh mục 2 cấp: chọn “Thuộc: …” để đặt làm danh mục con.
      </p>
      <div className="mt-4"><Flash error={error} saved={saved} /></div>

      <form action={saveCategory} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="mb-3 font-semibold">Thêm danh mục</p>
        <CategoryFields groups={groups} />
        <button className="btn-primary mt-3">Thêm</button>
      </form>

      <div className="mt-6 space-y-2">
        {tree.map((g) => (
          <div key={g.id} className="space-y-2">
            <CategoryCard c={g} groups={groups} />
            {g.children.map((c) => <CategoryCard key={c.id} c={c} groups={groups} sub />)}
          </div>
        ))}
      </div>
    </>
  );
}

import { deleteBrand, saveBrand } from "../../actions";
import { BrandLogo } from "@/components/BrandLogo";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Flash } from "@/components/admin/Flash";
import { requireAdmin } from "@/lib/admin";
import type { Brand } from "@/lib/types";

function BrandFields({ b }: { b?: Brand }) {
  return (
    <>
      {b && <input type="hidden" name="id" value={b.id} />}
      <input type="hidden" name="logo_url" value={b?.logo_url ?? ""} />
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_90px]">
        <input name="name" required defaultValue={b?.name} placeholder="Tên thương hiệu *" className="input" aria-label="Tên" />
        <input name="slug" defaultValue={b?.slug} placeholder="slug (tự tạo)" className="input" aria-label="Slug" />
        <input name="sort_order" type="number" defaultValue={b?.sort_order ?? 0} className="input" aria-label="Thứ tự" title="Thứ tự" />
      </div>
      <label className="mt-3 block text-sm text-slate-600">
        Logo: <input type="file" name="logo" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="ml-2 text-sm" />
      </label>
    </>
  );
}

export default async function AdminBrands({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("brands").select("*").order("sort_order");
  const brands = (data ?? []) as Brand[];

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Thương hiệu</h1>
      <div className="mt-4"><Flash error={error} saved={saved} /></div>

      <form action={saveBrand} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="mb-3 font-semibold">Thêm thương hiệu</p>
        <BrandFields />
        <button className="btn-primary mt-3">Thêm</button>
      </form>

      <div className="mt-6 grid gap-3 xl:grid-cols-2">
        {brands.map((b) => (
          <div key={b.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex h-12 items-center"><BrandLogo brand={b} className="max-h-10" /></div>
            <form action={saveBrand}>
              <BrandFields b={b} />
              <button className="btn-secondary mt-3">Lưu</button>
            </form>
            <form action={deleteBrand} className="mt-2">
              <input type="hidden" name="id" value={b.id} />
              <ConfirmButton message={`Xóa thương hiệu “${b.name}”?`}>Xóa thương hiệu</ConfirmButton>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}

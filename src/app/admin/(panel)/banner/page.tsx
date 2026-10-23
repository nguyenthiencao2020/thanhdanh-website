import { deleteBanner, saveBanner } from "../../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Flash } from "@/components/admin/Flash";
import { requireAdmin } from "@/lib/admin";
import type { Banner } from "@/lib/types";

function BannerFields({ b }: { b?: Banner }) {
  return (
    <>
      {b && <input type="hidden" name="id" value={b.id} />}
      <input type="hidden" name="image_url" value={b?.image_url ?? ""} />
      <div className="grid gap-3 sm:grid-cols-[1fr_90px]">
        <input name="title" required defaultValue={b?.title} placeholder="Tiêu đề lớn *" className="input" aria-label="Tiêu đề" />
        <input name="sort_order" type="number" defaultValue={b?.sort_order ?? 0} className="input" aria-label="Thứ tự" title="Thứ tự" />
      </div>
      <textarea name="subtitle" rows={2} defaultValue={b?.subtitle ?? ""} placeholder="Mô tả ngắn" className="input mt-3" aria-label="Mô tả" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input name="cta_label" defaultValue={b?.cta_label ?? ""} placeholder="Chữ trên nút, VD: Yêu cầu báo giá" className="input" aria-label="Chữ trên nút" />
        <input name="cta_url" defaultValue={b?.cta_url ?? ""} placeholder="Link của nút, VD: /lien-he" className="input" aria-label="Link" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
        {b?.image_url && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.image_url} alt="" className="h-16 w-28 rounded border border-slate-200 object-cover" />
            <label className="flex items-center gap-2 text-brand-700"><input type="checkbox" name="remove_image" /> Xóa ảnh</label>
          </>
        )}
        <label>
          Ảnh banner: <input type="file" name="image" accept="image/jpeg,image/png,image/webp" className="ml-2 text-sm" />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={b?.published ?? true} /> Hiển thị
        </label>
      </div>
    </>
  );
}

export default async function AdminBanners({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("banners").select("*").order("sort_order");
  const banners = (data ?? []) as Banner[];
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Banner trang chủ</h1>
      <p className="mt-1 text-sm text-slate-500">
        Slider đầu trang chủ, tự chuyển mỗi 6 giây. Ảnh nên ngang, tối thiểu 1920×800px, dưới 4MB (ảnh kho hàng, cửa hàng, sản phẩm…).
        Banner không có ảnh sẽ hiển thị ảnh minh họa.
      </p>
      <div className="mt-4"><Flash error={error} saved={saved} /></div>
      <form action={saveBanner} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="mb-3 font-semibold">Thêm banner</p>
        <BannerFields />
        <button className="btn-primary mt-3">Thêm</button>
      </form>
      <div className="mt-6 space-y-3">
        {banners.map((b) => (
          <div key={b.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <form action={saveBanner}>
              <BannerFields b={b} />
              <button className="btn-secondary mt-3">Lưu</button>
            </form>
            <form action={deleteBanner} className="mt-2">
              <input type="hidden" name="id" value={b.id} />
              <ConfirmButton message={`Xóa banner “${b.title}”?`}>Xóa banner</ConfirmButton>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}

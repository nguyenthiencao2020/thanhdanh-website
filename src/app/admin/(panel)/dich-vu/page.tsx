import { deleteService, saveService } from "../../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Flash } from "@/components/admin/Flash";
import { requireAdmin } from "@/lib/admin";
import type { Service } from "@/lib/types";

const ICONS = ["chat", "search", "box", "truck", "cog", "shield", "bolt", "cpu", "wind", "pipe", "clock", "phone"];

function ServiceFields({ s }: { s?: Service }) {
  return (
    <>
      {s && <input type="hidden" name="id" value={s.id} />}
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_120px_90px]">
        <input name="title" required defaultValue={s?.title} placeholder="Tên dịch vụ *" className="input" aria-label="Tên" />
        <input name="slug" defaultValue={s?.slug} placeholder="slug (tự tạo)" className="input" aria-label="Slug" />
        <select name="icon" defaultValue={s?.icon ?? "cog"} className="input" aria-label="Biểu tượng">
          {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <input name="sort_order" type="number" defaultValue={s?.sort_order ?? 0} className="input" aria-label="Thứ tự" title="Thứ tự" />
      </div>
      <input name="summary" defaultValue={s?.summary ?? ""} placeholder="Mô tả ngắn (hiện ở trang chủ)" className="input mt-3" aria-label="Mô tả ngắn" />
      <textarea name="content" rows={3} defaultValue={s?.content ?? ""} placeholder="Mô tả chi tiết (trang Dịch vụ)" className="input mt-3" aria-label="Mô tả chi tiết" />
    </>
  );
}

export default async function AdminServices({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("services").select("*").order("sort_order");
  const services = (data ?? []) as Service[];
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Dịch vụ</h1>
      <div className="mt-4"><Flash error={error} saved={saved} /></div>
      <form action={saveService} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="mb-3 font-semibold">Thêm dịch vụ</p>
        <ServiceFields />
        <button className="btn-primary mt-3">Thêm</button>
      </form>
      <div className="mt-6 space-y-3">
        {services.map((s) => (
          <div key={s.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <form action={saveService}>
              <ServiceFields s={s} />
              <button className="btn-secondary mt-3">Lưu</button>
            </form>
            <form action={deleteService} className="mt-2">
              <input type="hidden" name="id" value={s.id} />
              <ConfirmButton message={`Xóa dịch vụ “${s.title}”?`}>Xóa dịch vụ</ConfirmButton>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}

import Link from "next/link";
import { deletePage, savePage } from "../../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Flash } from "@/components/admin/Flash";
import { requireAdmin } from "@/lib/admin";
import type { Page } from "@/lib/types";

function PageFields({ p }: { p?: Page }) {
  return (
    <>
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_90px]">
        <input name="title" required defaultValue={p?.title} placeholder="Tiêu đề trang *" className="input" aria-label="Tiêu đề" />
        <input name="slug" defaultValue={p?.slug} placeholder="slug, VD: chinh-sach-bao-hanh" className="input" aria-label="Slug" />
        <input name="sort_order" type="number" defaultValue={p?.sort_order ?? 0} className="input" aria-label="Thứ tự" title="Thứ tự" />
      </div>
      <textarea name="content" rows={p ? 10 : 5} defaultValue={p?.content ?? ""} placeholder="Nội dung" className="input mt-3" aria-label="Nội dung" />
      <p className="mt-1 text-xs text-slate-500">“## ” = tiêu đề, “- ” = gạch đầu dòng, “1. ” = danh sách số, dòng trống = đoạn mới.</p>
    </>
  );
}

export default async function AdminPages({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("pages").select("*").order("sort_order");
  const pages = (data ?? []) as Page[];
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Trang chính sách</h1>
      <p className="mt-1 text-sm text-slate-500">Các trang này hiện ở cột “Chính sách” dưới chân trang, đường dẫn dạng /slug.</p>
      <div className="mt-4"><Flash error={error} saved={saved} /></div>
      <form action={savePage} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="mb-3 font-semibold">Thêm trang</p>
        <PageFields />
        <button className="btn-primary mt-3">Thêm</button>
      </form>
      <div className="mt-6 space-y-3">
        {pages.map((p) => (
          <div key={p.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold">{p.title}</p>
              <Link href={`/${p.slug}`} target="_blank" className="text-sm text-steel-600 hover:underline">Xem ↗</Link>
            </div>
            <form action={savePage}>
              <PageFields p={p} />
              <button className="btn-secondary mt-3">Lưu</button>
            </form>
            <form action={deletePage} className="mt-2">
              <input type="hidden" name="id" value={p.id} />
              <ConfirmButton message={`Xóa trang “${p.title}”?`}>Xóa trang</ConfirmButton>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}

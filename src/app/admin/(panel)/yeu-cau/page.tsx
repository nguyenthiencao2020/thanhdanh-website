import Link from "next/link";
import { deleteInquiry, toggleInquiry } from "../../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/admin";
import type { Inquiry } from "@/lib/types";

type Row = Inquiry & { product: { name: string; slug: string } | null };

export default async function InquiriesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("inquiries")
    .select("*, product:products(name,slug)")
    .order("handled")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as Row[];
  const fmt = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Yêu cầu báo giá</h1>
      {rows.length === 0 && <p className="mt-6 text-slate-500">Chưa có yêu cầu nào.</p>}
      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <div key={r.id} className={`rounded-xl bg-white p-5 shadow-sm ring-1 ${r.handled ? "opacity-60 ring-slate-200" : "ring-brand-500/40"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">
                  {r.name} {r.company && <span className="font-normal text-slate-500">– {r.company}</span>}
                </p>
                <p className="mt-1 text-sm">
                  <a href={`tel:${r.phone}`} className="font-semibold text-steel-600 hover:underline">{r.phone}</a>
                  {r.email && (
                    <> · <a href={`mailto:${r.email}`} className="text-steel-600 hover:underline">{r.email}</a></>
                  )}
                </p>
              </div>
              <p className="text-xs text-slate-500">{fmt.format(new Date(r.created_at))}</p>
            </div>
            {r.product && (
              <p className="mt-2 text-sm">
                Sản phẩm:{" "}
                <Link href={`/san-pham/${r.product.slug}`} target="_blank" className="text-steel-600 hover:underline">{r.product.name}</Link>
              </p>
            )}
            {r.message && <p className="mt-2 text-sm whitespace-pre-line text-slate-700">{r.message}</p>}
            <div className="mt-4 flex items-center gap-4">
              <form action={toggleInquiry}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="handled" value={String(!r.handled)} />
                <button className="text-sm font-medium text-steel-600 hover:underline">
                  {r.handled ? "Đánh dấu chưa xử lý" : "✓ Đánh dấu đã xử lý"}
                </button>
              </form>
              <form action={deleteInquiry}>
                <input type="hidden" name="id" value={r.id} />
                <ConfirmButton message="Xóa yêu cầu này?">Xóa</ConfirmButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

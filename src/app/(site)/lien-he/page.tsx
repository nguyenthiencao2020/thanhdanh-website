import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { QuoteForm } from "@/components/QuoteForm";
import { getSettings } from "@/lib/data";
import { phoneDigits } from "@/lib/utils";

export const metadata: Metadata = { title: "Liên hệ – Báo giá" };

export default async function ContactPage() {
  const s = await getSettings();
  const phones = [s.phone, s.phone2].filter((p): p is string => Boolean(p));

  return (
    <>
    <PageHeader
      title="Liên hệ – Báo giá"
      description="Gửi danh sách mã hàng, số lượng cần mua. Chúng tôi sẽ liên hệ lại với báo giá tốt nhất."
      crumbs={[{ label: "Liên hệ" }]}
    />
    <div className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Gửi yêu cầu</h2>
          <QuoteForm />
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Icon name="clock" className="h-4 w-4" /> Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
          </p>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-steel-700 to-steel-900 p-6 text-steel-100 shadow-lg">
            <p className="font-bold text-white uppercase">{s.company_name}</p>
            <ul className="mt-4 space-y-4 text-sm">
              {s.address && (
                <li className="flex gap-3"><Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0" /> {s.address}</li>
              )}
              {phones.map((p) => (
                <li key={p} className="flex gap-3">
                  <Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0" />
                  <a href={`tel:${phoneDigits(p)}`} className="text-base font-bold text-white hover:underline">{p}</a>
                </li>
              ))}
              {s.email && (
                <li className="flex gap-3">
                  <Icon name="mail" className="mt-0.5 h-5 w-5 shrink-0" />
                  <a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a>
                </li>
              )}
              {s.zalo && (
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-steel-500 text-[8px] font-bold text-white">Zalo</span>
                  <a href={`https://zalo.me/${phoneDigits(s.zalo)}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Chat Zalo: {s.zalo}
                  </a>
                </li>
              )}
              {s.business_hours && (
                <li className="flex gap-3"><Icon name="clock" className="mt-0.5 h-5 w-5 shrink-0" /> {s.business_hours}</li>
              )}
            </ul>
          </div>
          {s.map_embed_url && (
            <iframe
              src={s.map_embed_url}
              title="Bản đồ"
              className="h-72 w-full rounded-3xl border-0 shadow-sm"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </aside>
      </div>
    </div>
    </>
  );
}

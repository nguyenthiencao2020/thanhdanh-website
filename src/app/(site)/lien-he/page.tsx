import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { getSettings } from "@/lib/data";
import { phoneDigits } from "@/lib/utils";

export const metadata: Metadata = { title: "Liên hệ – Báo giá" };

export default async function ContactPage() {
  const s = await getSettings();
  const phones = [s.phone, s.phone2].filter((p): p is string => Boolean(p));

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold text-steel-900 sm:text-3xl">Liên hệ – Báo giá</h1>
      <p className="mt-2 max-w-2xl text-slate-500">
        Gửi danh sách mã hàng, số lượng cần mua. Chúng tôi sẽ liên hệ lại với báo giá tốt nhất.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Gửi yêu cầu</h2>
          <QuoteForm />
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl bg-steel-900 p-6 text-steel-100">
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
              {s.business_hours && (
                <li className="flex gap-3"><Icon name="clock" className="mt-0.5 h-5 w-5 shrink-0" /> {s.business_hours}</li>
              )}
            </ul>
          </div>
          {s.map_embed_url && (
            <iframe
              src={s.map_embed_url}
              title="Bản đồ"
              className="h-72 w-full rounded-xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </aside>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { CtaBanner } from "@/components/CtaBanner";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getServices, getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Dịch vụ" };

const steps = [
  { icon: "chat", title: "Tiếp nhận", text: "Nhận yêu cầu qua hotline, Zalo, email hoặc form." },
  { icon: "search", title: "Kiểm tra & tư vấn", text: "Xác định thông số, đề xuất mã phù hợp hoặc tương đương." },
  { icon: "mail", title: "Báo giá", text: "Gửi báo giá chi tiết: đơn giá, thời gian giao, bảo hành." },
  { icon: "truck", title: "Giao hàng", text: "Đóng gói, giao hàng tận nơi theo tiến độ đã thống nhất." },
  { icon: "shield", title: "Hỗ trợ sau bán", text: "Hỗ trợ kỹ thuật, tiếp nhận bảo hành theo chính sách." },
];

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  return (
    <>
      <PageHeader
        title="Dịch vụ"
        description="Không chỉ cung cấp vật tư — chúng tôi đồng hành cùng nhà máy từ khâu chọn thiết bị đến hỗ trợ sau bán hàng."
        crumbs={[{ label: "Dịch vụ" }]}
      />

      <section className="container-page py-16">
        <SectionHeading eyebrow="Chúng tôi làm gì" title="Dịch vụ của chúng tôi" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 90}>
              <article id={s.slug} className="group relative h-full scroll-mt-28 overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-xl hover:shadow-steel-900/10">
                <span className="absolute -top-6 -right-6 text-[7rem] leading-none font-black text-slate-100 transition group-hover:text-brand-50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30">
                  <Icon name={s.icon ?? "cog"} className="h-7 w-7" />
                </span>
                <h3 className="relative mt-6 text-xl font-bold text-slate-900">{s.title}</h3>
                {s.summary && <p className="relative mt-2 font-medium text-steel-700">{s.summary}</p>}
                {s.content && <p className="relative mt-3 text-sm leading-relaxed text-slate-500">{s.content}</p>}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-steel-900 py-16 text-white">
        <div className="bg-blueprint absolute inset-0 -z-10" />
        <div className="container-page">
          <SectionHeading eyebrow="Quy trình" title="Quy trình làm việc" center dark />
          <ol className="mt-12 grid gap-5 md:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 100} className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <p className="mt-4 text-xs font-bold tracking-wider text-brand-100">BƯỚC {i + 1}</p>
                  <h3 className="mt-1 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-steel-100/80">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page grid items-start gap-10 py-16 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="text-sm font-semibold tracking-wider text-steel-600 uppercase">Đặt lịch tư vấn</p>
          <h2 className="mt-1 text-3xl font-bold text-steel-900 sm:text-4xl">Cần tư vấn thiết bị cho nhà máy?</h2>
          <p className="mt-4 text-slate-600">
            Để lại thông tin và nhu cầu, kỹ thuật của chúng tôi sẽ liên hệ lại để tư vấn và gửi báo giá phù hợp.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-700">
            {["Tư vấn miễn phí, không ràng buộc", "Hỗ trợ tìm mã thay thế tương đương", "Báo giá rõ ràng theo từng mã hàng"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700"><Icon name="check" className="h-4 w-4" /></span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-semibold text-slate-900">Gửi yêu cầu tư vấn</h3>
          <QuoteForm />
        </Reveal>
      </section>

      <section className="container-page">
        <CtaBanner phone={settings.phone} zalo={settings.zalo} />
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { CtaBanner } from "@/components/CtaBanner";
import { Gear } from "@/components/Gear";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { RichText } from "@/components/RichText";
import { countByCategory, nonEmptyTree } from "@/lib/catalog";
import { getBrands, getCategoryTree, getProductPairs, getSettings } from "@/lib/data";
import { getLines } from "@/lib/lines";

export const metadata: Metadata = { title: "Giới thiệu" };

/** Icon per core value (by title), falling back to the list order. */
const VALUE_ICONS: Record<string, string> = { "uy tín": "shield", "chất lượng": "diamond", "tận tâm": "handshake", "nhanh chóng": "truck" };
const FALLBACK_ICONS = ["shield", "diamond", "handshake", "truck", "chat", "cog"];

/** "Title | description" per line */
const parseValues = (text: string | null) =>
  (text ?? "")
    .split("\n")
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter((r) => r[0]);

/** First paragraph of a multi-paragraph text. */
const firstPara = (t: string | null) => (t ?? "").split(/\n\s*\n/)[0]?.trim() ?? "";

export default async function AboutPage() {
  const [settings, fullTree, brands, pairs] = await Promise.all([getSettings(), getCategoryTree(), getBrands(), getProductPairs()]);
  // Only product groups that have products (empty ones are hidden site-wide).
  const categories = nonEmptyTree(fullTree, countByCategory(fullTree, pairs));
  const brandCount = new Set(pairs.map((p) => p.brand).filter(Boolean)).size || brands.length;
  const values = parseValues(settings.core_values);

  return (
    <>
      {/* Hero: light, logo framed over the factory photo */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-sky-50 to-blue-100/70">
        <div className="absolute top-0 -right-24 -z-10 hidden h-full w-[42%] skew-x-[-14deg] bg-gradient-to-b from-blue-600/10 to-blue-700/25 lg:block" />
        <div className="absolute top-0 right-6 -z-10 hidden h-full w-6 skew-x-[-14deg] bg-blue-700/80 lg:block" />
        <Gear teeth={12} className="absolute -bottom-20 -left-16 -z-10 h-64 w-64 text-blue-200/50" />

        <div className="container-page grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_1fr] lg:py-14">
          <Reveal>
            <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand-600">Trang chủ</Link> / <span className="text-slate-800">Giới thiệu</span>
            </nav>
            <p className="mt-5 text-sm font-bold tracking-[0.18em] text-blue-700 uppercase">{settings.tagline ?? "Nhà cung cấp vật tư nhà máy"}</p>
            <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight text-balance text-steel-900 sm:text-4xl xl:text-[2.85rem]">
              {settings.short_name} <span className="text-brand-600">–</span> Spare Parts Factory
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Cung cấp thiết bị điện, tự động hóa và vật tư cho nhà máy từ {brandCount}+ thương hiệu uy tín — tư vấn chọn mã, báo giá và giao hàng nhanh.
            </p>
            <div className="mt-6 grid max-w-lg grid-cols-2 gap-3">
              {[
                { icon: "shield", t: "Hàng chính hãng", d: "Nguồn gốc rõ ràng" },
                { icon: "bolt", t: "Nhanh chóng", d: "Báo giá & giao hàng nhanh" },
              ].map((x) => (
                <div key={x.t} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm sm:p-4">
                  <Icon name={x.icon} className="h-8 w-8 shrink-0 text-brand-600 sm:h-9 sm:w-9" />
                  <div className="min-w-0">
                    <p className="font-bold text-steel-900">{x.t}</p>
                    <p className="text-xs text-slate-500 sm:text-sm">{x.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/san-pham" className="btn-primary px-6 py-3 shadow-lg shadow-brand-600/25">
                Xem sản phẩm <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/lien-he" className="btn-outline bg-white px-6 py-3">Liên hệ báo giá</Link>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl shadow-blue-900/20">
              <Image src="/img/banner/hero-nha-may.jpg" alt="" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/55" />
              <div className="relative flex aspect-[16/10] items-center justify-center p-8 sm:p-10">
                <BrandMark name={settings.short_name} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-page py-12 lg:py-16">
        {/* Mission (blue, factory photo) + vision (red) */}
        {(settings.mission || settings.vision) && (
          <section className="grid gap-6 lg:grid-cols-2">
            {settings.mission && (
              <Reveal className="relative isolate h-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-800 to-steel-900 text-white shadow-xl shadow-blue-900/20">
                <div className="absolute inset-y-0 right-0 -z-10 hidden w-[42%] sm:block">
                  <Image src="/img/banner/hero-nha-may-900.jpg" alt="" fill sizes="300px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-800/40 to-transparent" />
                </div>
                <div className="flex gap-4 p-7 sm:max-w-[66%] sm:p-8">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                    <Icon name="cog" className="h-7 w-7" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold">Sứ mệnh</h2>
                    <p className="mt-2 text-sm leading-relaxed text-blue-50/90 sm:text-base">{firstPara(settings.mission)}</p>
                    <Link href="/dich-vu" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline">
                      Dịch vụ của chúng tôi <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            )}
            {settings.vision && (
              <Reveal delay={120} className="relative isolate h-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-xl shadow-brand-600/25">
                <Gear teeth={12} className="animate-spin-slow absolute -right-12 -bottom-16 -z-10 h-56 w-56 text-white/10" />
                <div className="flex gap-4 p-7 sm:p-8">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                    <Icon name="handshake" className="h-7 w-7" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold">Tầm nhìn &amp; cam kết</h2>
                    <p className="mt-2 text-sm leading-relaxed text-brand-50/90 sm:text-base">{settings.vision}</p>
                    <Link href="/lien-he" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline">
                      Liên hệ hợp tác <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            )}
          </section>
        )}

        {/* Story + numbers */}
        <section className="mt-16 grid items-start gap-10 lg:mt-20 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="text-sm font-bold tracking-[0.18em] text-blue-700 uppercase">Về chúng tôi</p>
            <h2 className="mt-1 text-3xl font-bold text-steel-900">Đồng hành cùng nhà máy của bạn</h2>
            <RichText text={settings.about} className="mt-5" />
          </Reveal>
          <Reveal delay={120}>
            <dl className="grid grid-cols-2 gap-4">
              {[
                { n: `${brandCount}+`, l: "Thương hiệu đang cung cấp", icon: "diamond" },
                { n: `${getLines().length}`, l: "Dòng hàng", icon: "box" },
                { n: `${categories.length}`, l: "Nhóm sản phẩm", icon: "cpu" },
                { n: "24H", l: "Hỗ trợ báo giá nhanh", icon: "clock" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <Icon name={s.icon} className="h-6 w-6 text-blue-700" />
                  <dd className="mt-3 text-3xl font-extrabold text-brand-600">{s.n}</dd>
                  <dt className="mt-1 text-sm text-slate-500">{s.l}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>

        {/* Core values */}
        {values.length > 0 && (
          <section className="mt-16 lg:mt-20">
            <Reveal className="text-center">
              <p className="flex items-center justify-center gap-3 text-sm font-bold tracking-[0.18em] text-blue-700 uppercase">
                <span className="h-px w-10 bg-blue-700/40 sm:w-24" /> Giá trị cốt lõi <span className="h-px w-10 bg-blue-700/40 sm:w-24" />
              </p>
              <h2 className="mt-2 text-3xl font-bold text-steel-900">Những giá trị chúng tôi theo đuổi</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(([title, text], i) => (
                <Reveal key={title} delay={i * 90}>
                  <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-lg">
                    <Icon name={VALUE_ICONS[title.toLowerCase()] ?? FALLBACK_ICONS[i % FALLBACK_ICONS.length]} className="mx-auto h-12 w-12 text-brand-600 transition group-hover:scale-110" />
                    <h3 className="mt-4 text-lg font-bold text-steel-900">{title}</h3>
                    {text && <p className="mt-2 text-sm text-slate-500">{text}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Product groups */}
        <section className="mt-16 lg:mt-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="border-l-4 border-brand-600 pl-3 text-2xl font-bold text-steel-900 sm:text-3xl">Lĩnh vực cung cấp</h2>
            <Link href="/san-pham" className="btn-outline rounded-full px-5 py-2 text-sm">
              Xem tất cả sản phẩm <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </Reveal>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map((c, i) => (
              <li key={c.slug}>
                <Reveal delay={(i % 4) * 70}>
                  <Link
                    href={`/danh-muc-san-pham/${c.slug}`}
                    className="group flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-lg"
                  >
                    {c.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image_url} alt="" loading="lazy" className="h-16 w-20 shrink-0 object-contain" />
                    ) : (
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                        <Icon name={c.icon ?? "box"} className="h-7 w-7" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="leading-snug font-bold text-steel-900 group-hover:text-brand-600">{c.name}</h3>
                      {c.description && <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 sm:text-sm">{c.description}</p>}
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 lg:mt-20">
          <CtaBanner
            title={`Hợp tác cùng ${settings.short_name}`}
            text="Chúng tôi luôn sẵn sàng lắng nghe và cung ứng vật tư lâu dài cho nhà máy của bạn."
            phone={settings.phone}
            zalo={settings.zalo}
          />
        </section>
      </div>
    </>
  );
}

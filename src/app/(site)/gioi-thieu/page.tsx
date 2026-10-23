import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { CtaBanner } from "@/components/CtaBanner";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { RichText } from "@/components/RichText";
import { SectionHeading } from "@/components/SectionHeading";
import { getBrands, getCategoryTree, getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Giới thiệu" };

const valueIcons = ["shield", "check", "chat", "clock", "cog", "box"];

/** "Title | description" per line */
const parseValues = (text: string | null) =>
  (text ?? "")
    .split("\n")
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter((r) => r[0]);

export default async function AboutPage() {
  const [settings, categories, brands] = await Promise.all([getSettings(), getCategoryTree(), getBrands()]);
  return (
    <>
      <PageHeader title={`Về ${settings.short_name}`} description={settings.tagline} crumbs={[{ label: "Giới thiệu" }]} />

      <div className="container-page py-14">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">{settings.company_name}</p>
            <h2 className="mt-2 text-3xl font-bold text-steel-900">Đồng hành cùng nhà máy của bạn</h2>
            <RichText text={settings.about} className="mt-6" />
            <dl className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
              <div className="rounded-2xl bg-slate-50 p-5">
                <dd className="text-3xl font-extrabold text-brand-600">{brands.length}+</dd>
                <dt className="mt-1 text-sm text-slate-500">Thương hiệu phân phối</dt>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <dd className="text-3xl font-extrabold text-brand-600">{categories.length}</dd>
                <dt className="mt-1 text-sm text-slate-500">Nhóm sản phẩm</dt>
              </div>
            </dl>
            <Link href="/lien-he" className="btn-primary mt-8 px-6 py-3">
              Liên hệ với chúng tôi <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={150} className="relative">
            <div className="absolute -inset-4 -z-10 rotate-2 rounded-[2rem] bg-gradient-to-br from-steel-100 to-brand-100" />
            <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
              <div className="flex justify-center py-6">
                <BrandMark name={settings.short_name} subtitle={settings.english_name ?? "Factory Supplies"} size="lg" />
              </div>
            </div>
          </Reveal>
        </div>

        {(settings.mission || settings.vision) && (
          <section className="mt-20 grid gap-6 lg:grid-cols-2">
            {settings.mission && (
              <Reveal className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-steel-700 to-steel-900 p-8 text-white shadow-xl">
                <Icon name="shield" className="absolute -right-6 -bottom-6 h-40 w-40 text-white/10" />
                <p className="text-sm font-semibold tracking-wider text-brand-100 uppercase">Sứ mệnh</p>
                <RichText text={settings.mission} className="mt-4 text-steel-100 [&_p]:text-steel-100" />
              </Reveal>
            )}
            {settings.vision && (
              <Reveal delay={120} className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white shadow-xl">
                <Icon name="search" className="absolute -right-6 -bottom-6 h-40 w-40 text-white/10" />
                <p className="text-sm font-semibold tracking-wider text-brand-100 uppercase">Tầm nhìn</p>
                <p className="mt-4 text-xl leading-relaxed font-semibold">{settings.vision}</p>
              </Reveal>
            )}
          </section>
        )}

        {parseValues(settings.core_values).length > 0 && (
          <section className="mt-20">
            <SectionHeading eyebrow="Giá trị cốt lõi" title="Những giá trị chúng tôi theo đuổi" center />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {parseValues(settings.core_values).map(([title, text], i) => (
                <Reveal key={title} delay={i * 90}>
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-lg">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                      <Icon name={valueIcons[i % valueIcons.length]} className="h-7 w-7" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                    {text && <p className="mt-2 text-sm text-slate-500">{text}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20">
          <Reveal>
            <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">Lĩnh vực</p>
            <h2 className="mt-1 text-3xl font-bold text-steel-900">Lĩnh vực cung cấp</h2>
          </Reveal>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <li key={c.slug}>
                <Reveal delay={i * 80}>
                  <Link
                    href={`/danh-muc-san-pham/${c.slug}`}
                    className="group flex h-full gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-lg"
                  >
                    {c.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image_url} alt="" loading="lazy" className="h-20 w-28 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                        <Icon name={c.icon ?? "box"} className="h-8 w-8" />
                      </span>
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-brand-600">{c.name}</h3>
                      {c.description && <p className="mt-1 line-clamp-3 text-sm text-slate-500">{c.description}</p>}
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <CtaBanner
            title={`Hợp tác cùng ${settings.short_name}`}
            text="Trở thành đối tác cung ứng vật tư lâu dài cho nhà máy của bạn."
            phone={settings.phone}
            zalo={settings.zalo}
          />
        </section>
      </div>
    </>
  );
}

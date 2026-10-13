import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { getBrands, getCategories, getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Giới thiệu" };

export default async function AboutPage() {
  const [settings, categories, brands] = await Promise.all([getSettings(), getCategories(), getBrands()]);
  return (
    <>
      <PageHeader title={`Về ${settings.short_name}`} description={settings.tagline} crumbs={[{ label: "Giới thiệu" }]} />

      <div className="container-page py-14">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">{settings.company_name}</p>
            <h2 className="mt-2 text-3xl font-bold text-steel-900">Đồng hành cùng nhà máy của bạn</h2>
            <div className="prose-content mt-6 text-slate-700">
              {(settings.about ?? "").split(/\n{2,}/).map((para, i) => (
                <p key={i} className="whitespace-pre-line">{para}</p>
              ))}
            </div>
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
              <Image src="/logo.png" alt={settings.company_name} width={1000} height={547} className="h-auto w-full" />
            </div>
          </Reveal>
        </div>

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
                    href={`/san-pham?danh-muc=${c.slug}`}
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
      </div>
    </>
  );
}

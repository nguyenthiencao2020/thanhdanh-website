import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getCategories, getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Giới thiệu" };

export default async function AboutPage() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  return (
    <div className="container-page py-10">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-2xl font-bold text-steel-900 sm:text-3xl">Về {settings.short_name}</h1>
          <p className="mt-1 font-semibold text-brand-600 uppercase">{settings.company_name}</p>
          <div className="prose-content mt-6 text-slate-700">
            {(settings.about ?? "").split(/\n{2,}/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">{para}</p>
            ))}
          </div>
          <Link href="/lien-he" className="btn-primary mt-4">Liên hệ với chúng tôi</Link>
        </div>
        <div className="rounded-2xl bg-cream p-6">
          <Image src="/logo.png" alt={settings.company_name} width={1200} height={593} className="h-auto w-full" />
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-xl font-bold text-steel-900">Lĩnh vực cung cấp</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <li key={c.slug} className="flex gap-4 rounded-xl border border-slate-200 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon name={c.icon ?? "box"} />
              </span>
              <div>
                <Link href={`/san-pham?danh-muc=${c.slug}`} className="font-semibold text-slate-900 hover:text-brand-600">
                  {c.name}
                </Link>
                {c.description && <p className="mt-1 text-sm text-slate-500">{c.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

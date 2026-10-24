import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/CtaBanner";
import { PageHeader } from "@/components/PageHeader";
import { RichText } from "@/components/RichText";
import { getPage, getPages, getSettings } from "@/lib/data";

/** Policy / static pages managed in Admin → Trang chính sách (e.g. /chinh-sach-bao-hanh). */
type Params = Promise<{ page: string }>;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = await getPage((await params).page);
  return page ? { title: page.title } : {};
}

export default async function StaticPage({ params }: { params: Params }) {
  const { page: slug } = await params;
  const [page, pages, settings] = await Promise.all([getPage(slug), getPages(), getSettings()]);
  if (!page) notFound();

  return (
    <>
      <PageHeader title={page.title} crumbs={[{ label: "Chính sách" }, { label: page.title }]} />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav className="rounded-2xl border border-slate-200 bg-white p-4" aria-label="Chính sách">
            <p className="mb-2 px-2 text-xs font-bold tracking-wider text-slate-500 uppercase">Chính sách</p>
            <ul className="space-y-0.5 text-sm">
              {pages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className={`block rounded-lg px-2 py-2 ${p.slug === page.slug ? "bg-brand-50 font-semibold text-brand-600" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <RichText text={page.content} />
        </div>
      </div>
      <div className="container-page">
        <CtaBanner title="Cần hỗ trợ thêm?" text="Liên hệ ngay để được giải đáp về chính sách và đơn hàng." phone={settings.phone} zalo={settings.zalo} />
      </div>
    </>
  );
}

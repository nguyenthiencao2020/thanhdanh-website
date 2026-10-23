import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { formatDate, PostCard } from "@/components/PostCard";
import { Reveal } from "@/components/Reveal";
import { getPostFacets, getPosts, getPostsPage } from "@/lib/data";

export const metadata: Metadata = { title: "Tin tức" };

const PAGE_SIZE = 9;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const category = one(sp["danh-muc"]);
  const tag = one(sp.tag);
  const q = one(sp.q);
  const page = Math.max(1, Number(one(sp.trang)) || 1);
  const filtered = Boolean(category || tag || q);

  const [{ items, total }, facets, recent] = await Promise.all([
    getPostsPage({ category, tag, q, page, pageSize: PAGE_SIZE }),
    getPostFacets(),
    getPosts({ limit: 5 }),
  ]);

  // Featured post sits on top of the first unfiltered page.
  const featured = !filtered && page === 1 ? (items.find((p) => p.featured) ?? items[0]) : undefined;
  const grid = featured ? items.filter((p) => p.id !== featured.id) : items;
  const title = category ?? (tag ? `#${tag}` : q ? `Tìm: “${q}”` : "Tin tức");

  return (
    <>
      <PageHeader
        title={title}
        description="Kiến thức kỹ thuật, hướng dẫn chọn thiết bị và tin tức từ Đạt Danh."
        crumbs={filtered ? [{ href: "/tin-tuc", label: "Tin tức" }, { label: title }] : [{ label: "Tin tức" }]}
      />

      <div className="container-page py-12">
        {featured && (
          <Reveal className="mb-10">
            <PostCard post={featured} large />
          </Reveal>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            {grid.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {grid.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 80}>
                    <PostCard post={p} />
                  </Reveal>
                ))}
              </div>
            ) : (
              !featured && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                  Chưa có bài viết nào{filtered ? " phù hợp" : ""}.
                </div>
              )
            )}
            <Pagination page={page} total={total} pageSize={PAGE_SIZE} basePath="/tin-tuc" params={{ "danh-muc": category, tag, q }} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-36 lg:self-start">
            <form action="/tin-tuc" className="relative">
              <input name="q" type="search" defaultValue={q} placeholder="Tìm bài viết…" className="input h-11 rounded-xl pr-10" aria-label="Tìm bài viết" />
              <Icon name="search" className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </form>

            {facets.categories.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Danh mục tin</h2>
                <ul className="mt-3 space-y-1 text-sm">
                  {facets.categories.map((c) => (
                    <li key={c.name}>
                      <Link
                        href={`/tin-tuc?danh-muc=${encodeURIComponent(c.name)}`}
                        className={`flex items-center justify-between rounded-lg px-2 py-2 ${category === c.name ? "bg-brand-50 font-semibold text-brand-600" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        {c.name} <span className="rounded-full bg-slate-100 px-2 text-xs text-slate-500">{c.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recent.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Bài viết mới nhất</h2>
                <ul className="mt-3 space-y-4">
                  {recent.map((p) => (
                    <li key={p.id}>
                      <Link href={`/tin-tuc/${p.slug}`} className="group flex gap-3">
                        {p.cover_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.cover_url} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                        )}
                        <span>
                          <span className="line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-brand-600">{p.title}</span>
                          <span className="text-xs text-slate-500">{formatDate(p.published_at)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {facets.tags.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Thẻ</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {facets.tags.map((t) => (
                    <Link
                      key={t.name}
                      href={`/tin-tuc?tag=${encodeURIComponent(t.name)}`}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${tag === t.name ? "border-steel-600 bg-steel-600 text-white" : "border-slate-200 text-slate-600 hover:border-steel-500"}`}
                    >
                      #{t.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

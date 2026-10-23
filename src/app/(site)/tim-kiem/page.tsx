import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { PostCard } from "@/components/PostCard";
import { ProductCard } from "@/components/ProductCard";
import { getPostsPage, getProductsPage } from "@/lib/data";
import Form from "next/form";

export const metadata: Metadata = { title: "Tìm kiếm", robots: { index: false } };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const q = one((await searchParams).q)?.trim();
  const [products, posts] = q
    ? await Promise.all([getProductsPage({ q, pageSize: 12 }), getPostsPage({ q, pageSize: 6 })])
    : [{ items: [], total: 0 }, { items: [], total: 0 }];

  return (
    <>
      <PageHeader title={q ? `Kết quả tìm kiếm cho: “${q}”` : "Tìm kiếm"} crumbs={[{ label: "Tìm kiếm" }]} />
      <div className="container-page py-10">
        <Form action="/tim-kiem" className="relative mx-auto max-w-2xl">
          <input
            name="q"
            type="search"
            defaultValue={q}
            autoFocus={!q}
            placeholder="Nhập tên, mã sản phẩm hoặc từ khóa bài viết…"
            className="input h-14 rounded-2xl pr-32 pl-5 text-base shadow-sm"
            aria-label="Từ khóa"
          />
          <button type="submit" className="btn-primary absolute top-1/2 right-2 -translate-y-1/2">
            <Icon name="search" className="h-4 w-4" /> Tìm
          </button>
        </Form>

        {q && (
          <>
            <section className="mt-12">
              <div className="flex items-end justify-between">
                <h2 className="text-xl font-bold text-steel-900">Sản phẩm <span className="text-slate-400">({products.total})</span></h2>
                {products.total > products.items.length && (
                  <Link href={`/san-pham?q=${encodeURIComponent(q)}`} className="text-sm font-semibold text-brand-600 hover:underline">Xem tất cả →</Link>
                )}
              </div>
              {products.items.length ? (
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {products.items.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <p className="mt-4 rounded-2xl bg-slate-50 p-6 text-slate-500">
                  Không tìm thấy sản phẩm. <Link href="/lien-he" className="font-semibold text-brand-600 hover:underline">Gửi mã hàng để được báo giá →</Link>
                </p>
              )}
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-bold text-steel-900">Bài viết <span className="text-slate-400">({posts.total})</span></h2>
              {posts.items.length ? (
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {posts.items.map((p) => <PostCard key={p.id} post={p} />)}
                </div>
              ) : (
                <p className="mt-4 rounded-2xl bg-slate-50 p-6 text-slate-500">Không có bài viết phù hợp.</p>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}

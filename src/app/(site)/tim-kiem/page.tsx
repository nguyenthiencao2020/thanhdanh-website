import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { PostCard } from "@/components/PostCard";
import { LineCard } from "@/components/LineCard";
import { ProductCard } from "@/components/ProductCard";
import { QuoteForm } from "@/components/QuoteForm";
import { getBrands, getPostsPage, getProductsPage } from "@/lib/data";
import { GENERIC_BRAND, lineHref, linesForSearch } from "@/lib/lines";
import Form from "next/form";

export const metadata: Metadata = { title: "Tìm kiếm", robots: { index: false } };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const q = one((await searchParams).q)?.trim();
  const [products, posts] = q
    ? await Promise.all([getProductsPage({ q, pageSize: 12 }), getPostsPage({ q, pageSize: 6 })])
    : [{ items: [], total: 0 }, { items: [], total: 0 }];
  const brands = q ? await getBrands() : [];
  const brandName = (slug: string) => (slug === GENERIC_BRAND.slug ? "" : (brands.find((b) => b.slug === slug)?.name ?? ""));
  const lines = q ? linesForSearch(q, brandName, products.items.map((p) => p.slug)) : [];
  const none = Boolean(q) && !lines.length && !products.total && !posts.total;

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
            placeholder="Nhập mã hàng, series, tên sản phẩm hoặc hãng…"
            className="input h-14 rounded-2xl pr-32 pl-5 text-base shadow-sm"
            aria-label="Từ khóa"
          />
          <button type="submit" className="btn-primary absolute top-1/2 right-2 -translate-y-1/2">
            <Icon name="search" className="h-4 w-4" /> Tìm
          </button>
        </Form>

        {q && (
          <>
            {lines.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold text-steel-900">Dòng hàng <span className="text-slate-400">({lines.length})</span></h2>
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {lines.map((l) => (
                    <LineCard key={`${l.brand}-${l.slug}`} href={lineHref(l)} brandName={brandName(l.brand)} name={l.name} series={l.series} image={l.image_url} />
                  ))}
                </div>
              </section>
            )}

            {products.total > 0 && (
              <section className="mt-12">
                <div className="flex items-end justify-between">
                  <h2 className="text-xl font-bold text-steel-900">Sản phẩm <span className="text-slate-400">({products.total})</span></h2>
                  {products.total > products.items.length && (
                    <Link href={`/san-pham?q=${encodeURIComponent(q)}`} className="text-sm font-semibold text-brand-600 hover:underline">Xem tất cả →</Link>
                  )}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {products.items.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            )}

            <section id="bao-gia" className={`mt-12 scroll-mt-28 rounded-3xl border bg-white p-5 sm:p-7 ${none ? "border-brand-200 ring-4 ring-brand-50" : "border-slate-200"}`}>
              <h2 className="text-lg font-bold text-steel-900">
                {none ? <>Chưa thấy “{q}” trên website — gửi mã này để báo giá</> : <>Không thấy đúng mã cần? Gửi yêu cầu báo giá</>}
              </h2>
              <p className="mt-1 text-sm text-slate-500">Chúng tôi cung cấp nhiều mã chưa đăng lên web. Ghi số lượng, có thể kèm ảnh tem nhãn — phản hồi nhanh trong giờ làm việc.</p>
              <QuoteForm compact defaultMessage={`Mã cần báo giá: ${q}\nSố lượng: `} />
            </section>

            {posts.items.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold text-steel-900">Bài viết <span className="text-slate-400">({posts.total})</span></h2>
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {posts.items.map((p) => <PostCard key={p.id} post={p} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}

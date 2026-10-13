import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components/Icon";
import { ProductCard, ProductImage } from "@/components/ProductCard";
import { QuoteForm } from "@/components/QuoteForm";
import { getProduct, getProducts, getSettings } from "@/lib/data";
import { phoneDigits } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

// Render on first request, then cache (ISR) — new products appear without a redeploy.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.summary ?? undefined,
    openGraph: product.image_url ? { images: [product.image_url] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()]);
  if (!product) notFound();

  const related = product.category
    ? (await getProducts({ category: product.category.slug, limit: 5 })).filter((p) => p.id !== product.id).slice(0, 4)
    : [];

  return (
    <div className="container-page py-10">
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-600">Trang chủ</Link> /{" "}
        <Link href="/san-pham" className="hover:text-brand-600">Sản phẩm</Link>
        {product.category && (
          <>
            {" / "}
            <Link href={`/san-pham?danh-muc=${product.category.slug}`} className="hover:text-brand-600">
              {product.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="aspect-[4/3] self-start overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <ProductImage product={product} />
        </div>

        <div>
          {product.brand && (
            <Link href={`/san-pham?thuong-hieu=${product.brand.slug}`} className="inline-block">
              <BrandLogo brand={product.brand} className="h-8" />
            </Link>
          )}
          <h1 className="mt-3 text-2xl font-bold text-steel-900 sm:text-3xl">{product.name}</h1>
          {product.sku && <p className="mt-1 text-sm text-slate-500">Mã: <span className="font-mono">{product.sku}</span></p>}
          <p className="mt-4 text-2xl font-bold text-brand-600">{product.price || "Liên hệ báo giá"}</p>
          {product.summary && <p className="mt-4 text-slate-600">{product.summary}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            {settings.phone && (
              <a href={`tel:${phoneDigits(settings.phone)}`} className="btn-primary px-5 py-3">
                <Icon name="phone" className="h-4 w-4" /> Gọi {settings.phone}
              </a>
            )}
            {settings.zalo && (
              <a href={`https://zalo.me/${phoneDigits(settings.zalo)}`} target="_blank" rel="noopener noreferrer" className="btn-secondary px-5 py-3">
                <Icon name="chat" className="h-4 w-4" /> Chat Zalo
              </a>
            )}
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-semibold text-slate-900">Yêu cầu báo giá sản phẩm này</h2>
            <QuoteForm productId={product.id} productName={product.name} compact />
          </div>
        </div>
      </div>

      {product.description && (
        <section className="mt-12 max-w-4xl">
          <h2 className="text-xl font-bold text-steel-900">Mô tả sản phẩm</h2>
          <div className="prose-content mt-4 text-slate-700">
            {product.description.split(/\n{2,}/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">{para}</p>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-steel-900">Sản phẩm liên quan</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

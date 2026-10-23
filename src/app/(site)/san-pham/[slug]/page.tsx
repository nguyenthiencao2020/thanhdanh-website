import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { QuoteForm } from "@/components/QuoteForm";
import { RichText } from "@/components/RichText";
import { Tabs } from "@/components/Tabs";
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

const quickPolicies = [
  { icon: "shield", title: "Bảo hành theo hãng", href: "/chinh-sach-bao-hanh" },
  { icon: "truck", title: "Giao hàng tận nơi", href: "/chinh-sach-van-chuyen" },
  { icon: "check", title: "Đổi trả khi giao sai", href: "/chinh-sach-doi-tra" },
];

/** "Name | value" lines → rows */
function parseSpecs(specs: string | null) {
  return (specs ?? "")
    .split("\n")
    .map((l) => l.split("|").map((s) => s.trim()))
    .filter((r) => r[0]);
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()]);
  if (!product) notFound();

  const related = product.category
    ? (await getProducts({ category: product.category.slug, limit: 9 })).filter((p) => p.id !== product.id).slice(0, 8)
    : [];
  const images = [product.image_url, ...(product.gallery ?? [])].filter((x): x is string => Boolean(x));
  const specs = parseSpecs(product.specs);
  const inStock = product.in_stock !== false;

  const tabs = [
    {
      id: "mo-ta",
      label: "Mô tả chi tiết",
      content: product.description ? (
        <RichText text={product.description} className="max-w-3xl" />
      ) : (
        <p className="text-slate-500">Nội dung đang được cập nhật. Liên hệ để nhận tài liệu chi tiết.</p>
      ),
    },
    {
      id: "thong-so",
      label: "Thông số kỹ thuật",
      content: specs.length ? (
        <div className="max-w-3xl overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {specs.map(([k, v], i) => (
                <tr key={i} className={i % 2 ? "bg-white" : "bg-slate-50"}>
                  <th className="w-2/5 px-4 py-3 text-left font-semibold text-slate-700">{k}</th>
                  <td className="px-4 py-3 text-slate-600">{v ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-500">Thông số đang được cập nhật. Liên hệ để được tư vấn chọn mã phù hợp.</p>
      ),
    },
    {
      id: "tai-lieu",
      label: "Tài liệu / Datasheet",
      content: product.datasheet_url ? (
        <a href={product.datasheet_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          <Icon name="box" className="h-4 w-4" /> Tải datasheet (PDF)
        </a>
      ) : (
        <p className="text-slate-500">Chưa có tài liệu trên website. Liên hệ để nhận catalogue / datasheet của sản phẩm.</p>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      <div className="container-page py-8">
        <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-600">Trang chủ</Link> /{" "}
          <Link href="/san-pham" className="hover:text-brand-600">Sản phẩm</Link>
          {product.category && (
            <>
              {" / "}
              <Link href={`/danh-muc-san-pham/${product.category.slug}`} className="hover:text-brand-600">{product.category.name}</Link>
            </>
          )}
          {" / "}
          <span className="text-slate-800">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <ProductGallery images={images} alt={product.name} />

          <div>
            {product.brand && (
              <Link href={`/san-pham?thuong-hieu=${product.brand.slug}`} className="inline-flex h-10 items-center">
                <BrandLogo brand={product.brand} className="max-h-8" />
              </Link>
            )}
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-steel-900 sm:text-3xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              {product.sku && (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600">
                  Mã: <span className="font-mono font-semibold text-slate-800">{product.sku}</span>
                </span>
              )}
              <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold ${inStock ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                <span className={`h-2 w-2 rounded-full ${inStock ? "bg-green-500" : "bg-amber-500"}`} />
                {inStock ? "Còn hàng" : "Đặt hàng"}
              </span>
            </div>
            <p className="mt-5 text-3xl font-extrabold text-brand-600">{product.price || "Liên hệ báo giá"}</p>
            {product.summary && <p className="mt-4 leading-relaxed text-slate-600">{product.summary}</p>}

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#bao-gia" className="btn-primary px-6 py-3">Yêu cầu báo giá</a>
              {settings.phone && (
                <a href={`tel:${phoneDigits(settings.phone)}`} className="btn-secondary px-6 py-3">
                  <Icon name="phone" className="h-4 w-4" /> Gọi ngay
                </a>
              )}
              {settings.zalo && (
                <a href={`https://zalo.me/${phoneDigits(settings.zalo)}`} target="_blank" rel="noopener noreferrer" className="btn-outline px-6 py-3">
                  <Icon name="chat" className="h-4 w-4" /> Zalo
                </a>
              )}
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {quickPolicies.map((p) => (
                <li key={p.title}>
                  <Link href={p.href} className="flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700 transition hover:border-steel-500">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-steel-50 text-steel-600">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div id="bao-gia" className="mt-6 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">Yêu cầu báo giá sản phẩm này</h2>
              <QuoteForm productId={product.id} productName={product.name} compact />
            </div>
          </div>
        </div>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white px-6 shadow-sm">
          <Tabs tabs={tabs} />
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold text-steel-900">Sản phẩm cùng danh mục</h2>
              {product.category && (
                <Link href={`/danh-muc-san-pham/${product.category.slug}`} className="text-sm font-semibold text-brand-600 hover:underline">
                  Xem tất cả →
                </Link>
              )}
            </div>
            <div className="-mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-4">
              {related.map((p) => (
                <div key={p.id} className="w-64 shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

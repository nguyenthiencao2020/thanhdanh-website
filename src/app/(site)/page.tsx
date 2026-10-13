import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { getBrands, getCategories, getProducts, getSettings } from "@/lib/data";
import { phoneDigits } from "@/lib/utils";

const strengths = [
  { icon: "shield", title: "Hàng chính hãng", text: "Phân phối thiết bị từ các thương hiệu uy tín, nguồn gốc rõ ràng." },
  { icon: "clock", title: "Báo giá nhanh", text: "Phản hồi báo giá trong thời gian ngắn nhất." },
  { icon: "truck", title: "Giao hàng tận nơi", text: "Giao hàng nhanh chóng đến tận nhà máy." },
  { icon: "chat", title: "Tư vấn kỹ thuật", text: "Hỗ trợ chọn mã, thay thế tương đương." },
];

export default async function HomePage() {
  const [settings, categories, brands, featured] = await Promise.all([
    getSettings(),
    getCategories(),
    getBrands(),
    getProducts({ featured: true, limit: 8 }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-steel-700 shadow-sm">
              <Icon name="cog" className="h-4 w-4 text-brand-600" /> {settings.tagline}
            </p>
            <h1 className="mt-5 text-3xl leading-tight font-extrabold text-steel-900 sm:text-4xl lg:text-5xl">
              Vật tư & thiết bị <span className="text-brand-600">cho nhà máy</span> của bạn
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
              Thiết bị điện công nghiệp, tự động hóa, khí nén – thủy lực, motor – hộp giảm tốc và phụ kiện đường ống từ các
              thương hiệu hàng đầu thế giới.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/lien-he" className="btn-primary px-6 py-3 text-base">
                Yêu cầu báo giá <Icon name="arrow" className="h-4 w-4" />
              </Link>
              {settings.phone && (
                <a href={`tel:${phoneDigits(settings.phone)}`} className="btn-secondary px-6 py-3 text-base">
                  <Icon name="phone" className="h-4 w-4" /> {settings.phone}
                </a>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl bg-white/70 p-4 shadow-xl ring-1 ring-black/5">
              <Image src="/logo.png" alt={settings.company_name} width={1000} height={547} priority className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-steel-900 sm:text-3xl">Danh mục sản phẩm</h2>
            <p className="mt-2 text-slate-500">Đáp ứng đầy đủ nhu cầu vật tư cho bảo trì và sản xuất.</p>
          </div>
          <Link href="/san-pham" className="hidden text-sm font-semibold text-brand-600 hover:underline sm:block">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/san-pham?danh-muc=${c.slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-500 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={c.icon ?? "box"} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{c.name}</h3>
              {c.description && <p className="mt-1 line-clamp-3 text-sm text-slate-500">{c.description}</p>}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="bg-slate-50 py-14">
          <div className="container-page">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-steel-900 sm:text-3xl">Sản phẩm nổi bật</h2>
              <Link href="/san-pham" className="text-sm font-semibold text-brand-600 hover:underline">
                Xem tất cả →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      <section className="container-page py-14">
        <h2 className="text-center text-2xl font-bold text-steel-900 sm:text-3xl">Thương hiệu phân phối</h2>
        <p className="mt-2 text-center text-slate-500">Cung cấp thiết bị từ các hãng uy tín hàng đầu thế giới</p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/san-pham?thuong-hieu=${b.slug}`}
              className="flex h-24 items-center justify-center rounded-lg border border-slate-200 bg-white p-4 grayscale transition hover:border-steel-500 hover:grayscale-0"
              title={b.name}
            >
              <BrandLogo brand={b} className="max-h-12" />
            </Link>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-steel-700 py-14 text-white">
        <div className="container-page">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Vì sao chọn {settings.short_name}?</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {strengths.map((s) => (
              <div key={s.title} className="rounded-xl bg-white/10 p-6">
                <Icon name={s.icon} className="h-8 w-8 text-brand-100" />
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-steel-100">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pt-14">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-600 p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold">Cần báo giá vật tư cho nhà máy?</h2>
            <p className="mt-1 text-brand-100">Gửi danh sách mã hàng, chúng tôi phản hồi nhanh chóng.</p>
          </div>
          <Link href="/lien-he" className="btn bg-white px-6 py-3 text-base text-brand-700 hover:bg-brand-50">
            Gửi yêu cầu ngay
          </Link>
        </div>
      </section>
    </>
  );
}

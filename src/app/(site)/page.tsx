import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Gear } from "@/components/Gear";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { getBrands, getCategories, getProducts, getSettings } from "@/lib/data";
import { phoneDigits } from "@/lib/utils";

const strengths = [
  { icon: "shield", title: "Hàng chính hãng", text: "Phân phối thiết bị từ các thương hiệu uy tín, nguồn gốc rõ ràng." },
  { icon: "clock", title: "Báo giá nhanh", text: "Gửi mã hàng, nhận báo giá trong thời gian ngắn nhất." },
  { icon: "truck", title: "Giao hàng tận nơi", text: "Giao hàng nhanh chóng đến tận nhà máy." },
  { icon: "chat", title: "Tư vấn kỹ thuật", text: "Hỗ trợ chọn mã, tìm thiết bị thay thế tương đương." },
];

const steps = [
  { title: "Gửi yêu cầu", text: "Gọi hotline, chat Zalo hoặc gửi form với mã hàng, số lượng." },
  { title: "Tư vấn chọn mã", text: "Kỹ thuật kiểm tra thông số, đề xuất mã phù hợp hoặc tương đương." },
  { title: "Nhận báo giá", text: "Báo giá rõ ràng: đơn giá, thời gian giao hàng, bảo hành." },
  { title: "Giao hàng", text: "Đóng gói cẩn thận, giao tận nơi, hỗ trợ sau bán hàng." },
];

// Used when a category has no image set in the CMS.
const categoryFallbackImage: Record<string, string> = {
  bolt: "/demo/aptomat.svg",
  cpu: "/demo/plc.svg",
  wind: "/demo/xi-lanh-khi-nen.svg",
  cog: "/demo/motor-giam-toc.svg",
  pipe: "/demo/van-bi-inox.svg",
};

const heroFallback = ["/demo/plc.svg", "/demo/bien-tan.svg", "/demo/xi-lanh-khi-nen.svg"];

export default async function HomePage() {
  const [settings, categories, brands, featured] = await Promise.all([
    getSettings(),
    getCategories(),
    getBrands(),
    getProducts({ featured: true, limit: 8 }),
  ]);

  // Hero collage: first three featured products that have an image, else demo art.
  const withImages = featured.filter((p) => p.image_url);
  const hero = heroFallback.map((src, i) => ({ src: withImages[i]?.image_url ?? src, alt: withImages[i]?.name ?? "" }));

  return (
    <>
      {/* ------------------------------------------------------------------ Hero */}
      <section className="relative isolate overflow-hidden bg-steel-900 text-white">
        <div className="bg-blueprint absolute inset-0 -z-10" />
        <div className="absolute -top-40 -left-40 -z-10 h-[520px] w-[520px] rounded-full bg-steel-500/30 blur-3xl" />
        <div className="absolute -right-32 -bottom-48 -z-10 h-[480px] w-[480px] rounded-full bg-brand-600/30 blur-3xl" />
        <Gear teeth={14} className="animate-spin-slow absolute -top-24 -right-24 -z-10 h-96 w-96 text-white/10" />
        <Gear teeth={10} className="animate-spin-slow-reverse absolute bottom-6 left-[38%] -z-10 h-40 w-40 text-white/10" />

        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-steel-100 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" /> {settings.tagline}
            </p>
            <h1 className="mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Vật tư & thiết bị
              <br />
              <span className="bg-gradient-to-r from-brand-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                cho nhà máy
              </span>{" "}
              của bạn
            </h1>
            <p className="mt-6 max-w-xl text-base text-steel-100/90 sm:text-lg">
              Thiết bị điện công nghiệp, tự động hóa, khí nén – thủy lực, motor – hộp giảm tốc và phụ kiện đường ống từ các
              thương hiệu hàng đầu thế giới.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/lien-he" className="btn-primary px-6 py-3 text-base shadow-lg shadow-brand-600/30">
                Yêu cầu báo giá <Icon name="arrow" className="h-4 w-4" />
              </Link>
              {settings.phone && (
                <a
                  href={`tel:${phoneDigits(settings.phone)}`}
                  className="btn border border-white/25 bg-white/10 px-6 py-3 text-base text-white backdrop-blur hover:bg-white/20"
                >
                  <Icon name="phone" className="h-4 w-4" /> {settings.phone}
                </a>
              )}
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[
                { value: `${brands.length}+`, label: "Thương hiệu" },
                { value: `${categories.length}`, label: "Nhóm sản phẩm" },
                { value: "Miễn phí", label: "Tư vấn chọn mã" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs text-steel-100/70 sm:text-sm">{s.label}</dt>
                  <dd className="text-2xl font-extrabold whitespace-nowrap text-white sm:text-3xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Floating product collage */}
          <div className="relative mx-auto h-[300px] w-full max-w-[560px] sm:h-[440px]">
            <div className="animate-float absolute top-6 left-0 w-[72%] overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl shadow-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero[0].src} alt={hero[0].alt} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div
              className="animate-float absolute top-0 right-0 hidden w-[42%] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl shadow-black/40 sm:block"
              style={{ animationDelay: "-2s" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero[1].src} alt={hero[1].alt} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div
              className="animate-float absolute right-2 bottom-0 w-[50%] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl shadow-black/40"
              style={{ animationDelay: "-4s" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero[2].src} alt={hero[2].alt} className="aspect-[4/3] w-full object-cover" />
            </div>
            {settings.phone && (
              <a
                href={`tel:${phoneDigits(settings.phone)}`}
                className="absolute bottom-4 left-2 hidden items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-4 py-3 shadow-xl backdrop-blur-md transition hover:bg-white/25 sm:bottom-10 sm:flex"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600">
                  <Icon name="phone" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs text-steel-100/80">Hotline tư vấn</span>
                  <span className="block font-bold">{settings.phone}</span>
                </span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Brand marquee */}
      <section className="border-b border-slate-200 bg-white py-6" aria-label="Thương hiệu phân phối">
        <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-6 group-hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((b, i) => (
              <Link
                key={`${b.slug}-${i}`}
                href={`/san-pham?thuong-hieu=${b.slug}`}
                className="flex h-14 w-40 shrink-0 items-center justify-center px-4 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                title={b.name}
                tabIndex={i >= brands.length ? -1 : undefined}
                aria-hidden={i >= brands.length || undefined}
              >
                <BrandLogo brand={b} className="max-h-10" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Categories */}
      <section className="container-page py-16">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">Danh mục</p>
            <h2 className="mt-1 text-3xl font-bold text-steel-900 sm:text-4xl">Sản phẩm chúng tôi cung cấp</h2>
            <p className="mt-2 text-slate-500">Đáp ứng đầy đủ nhu cầu vật tư cho bảo trì và sản xuất.</p>
          </div>
          <Link href="/san-pham" className="hidden text-sm font-semibold text-brand-600 hover:underline sm:block">
            Xem tất cả →
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => {
            const img = c.image_url ?? categoryFallbackImage[c.icon ?? ""];
            return (
              <Reveal key={c.slug} delay={i * 80}>
                <Link
                  href={`/san-pham?danh-muc=${c.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-xl hover:shadow-steel-900/10"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={c.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-steel-500">
                        <Icon name={c.icon ?? "box"} className="h-12 w-12" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-brand-600 shadow-sm backdrop-blur">
                      <Icon name={c.icon ?? "box"} className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 group-hover:text-brand-600">{c.name}</h3>
                    {c.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{c.description}</p>}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-steel-600 transition-all group-hover:gap-2 group-hover:text-brand-600">
                      Xem sản phẩm <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------- Featured products */}
      {featured.length > 0 && (
        <section className="bg-gradient-to-b from-slate-50 to-white py-16">
          <div className="container-page">
            <Reveal className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">Nổi bật</p>
                <h2 className="mt-1 text-3xl font-bold text-steel-900 sm:text-4xl">Sản phẩm được quan tâm</h2>
              </div>
              <Link href="/san-pham" className="text-sm font-semibold text-brand-600 hover:underline">
                Xem tất cả →
              </Link>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- Process */}
      <section className="container-page py-16">
        <Reveal className="text-center">
          <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">Quy trình</p>
          <h2 className="mt-1 text-3xl font-bold text-steel-900 sm:text-4xl">Đặt hàng đơn giản trong 4 bước</h2>
        </Reveal>
        <div className="relative mt-12">
          <div className="absolute top-7 right-[12%] left-[12%] hidden h-0.5 bg-gradient-to-r from-brand-500 via-steel-500 to-brand-500 md:block" />
          <ol className="relative grid gap-8 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 120} className="text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-steel-900 text-xl font-extrabold text-white shadow-lg ring-8 ring-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------------ Why us */}
      <section className="relative isolate overflow-hidden bg-steel-900 py-20 text-white">
        <div className="bg-blueprint absolute inset-0 -z-10" />
        <Gear teeth={16} className="animate-spin-slow absolute -bottom-32 -left-32 -z-10 h-[420px] w-[420px] text-white/10" />
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative mx-auto h-[280px] w-full max-w-[520px] sm:h-[380px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/motor-giam-toc.svg"
              alt=""
              className="absolute top-0 left-0 w-[70%] rounded-3xl border border-white/10 shadow-2xl shadow-black/40"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/contactor.svg"
              alt=""
              className="animate-float absolute right-0 bottom-0 w-[55%] rounded-3xl border border-white/10 shadow-2xl shadow-black/40"
            />
          </Reveal>
          <div>
            <Reveal>
              <p className="text-sm font-semibold tracking-wider text-brand-100 uppercase">Vì sao chọn chúng tôi</p>
              <h2 className="mt-1 text-3xl font-bold sm:text-4xl">Đối tác vật tư tin cậy cho nhà máy</h2>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {strengths.map((s, i) => (
                <Reveal key={s.title} delay={i * 100}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/25 hover:bg-white/10">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600">
                      <Icon name={s.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-steel-100/80">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- CTA */}
      <section className="container-page pt-16">
        <Reveal>
          <div className="relative isolate flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white shadow-xl shadow-brand-600/20 sm:flex-row sm:items-center sm:p-12">
            <Gear teeth={12} className="animate-spin-slow absolute -top-16 -right-10 -z-10 h-64 w-64 text-white/15" />
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Cần báo giá vật tư cho nhà máy?</h2>
              <p className="mt-2 text-brand-100">Gửi danh sách mã hàng, chúng tôi phản hồi nhanh chóng.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/lien-he" className="btn bg-white px-6 py-3 text-base text-brand-700 hover:bg-brand-50">
                Gửi yêu cầu ngay
              </Link>
              {settings.zalo && (
                <a
                  href={`https://zalo.me/${phoneDigits(settings.zalo)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn border border-white/40 px-6 py-3 text-base text-white hover:bg-white/10"
                >
                  Chat Zalo
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

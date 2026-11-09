import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { CountUp } from "@/components/CountUp";
import { Gear } from "@/components/Gear";
import { HeroSlider } from "@/components/HeroSlider";
import { Icon } from "@/components/Icon";
import { PostCard } from "@/components/PostCard";
import { ProductTabs } from "@/components/ProductTabs";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { countByBrand, countByCategory, featuredBrands, nonEmptyTree } from "@/lib/catalog";
import { buildCategoryTree, getBanners, getBrands, getCategories, getPosts, getProductPairs, getProducts, getSettings } from "@/lib/data";
import { categoryThumb } from "@/lib/utils";
import { phoneDigits } from "@/lib/utils";

const strengths = [
  { icon: "shield", title: "Hàng chính hãng", text: "Thiết bị từ các thương hiệu uy tín, nguồn gốc rõ ràng." },
  { icon: "clock", title: "Báo giá nhanh", text: "Gửi mã hàng, nhận báo giá trong thời gian ngắn nhất." },
  { icon: "truck", title: "Giao hàng tận nơi", text: "Giao nhanh đến tận nhà máy." },
  { icon: "chat", title: "Tư vấn kỹ thuật", text: "Hỗ trợ chọn mã, tìm mã tương đương." },
];

const steps = [
  { title: "Gửi yêu cầu", text: "Mã hàng, số lượng qua form, hotline hoặc Zalo." },
  { title: "Tư vấn chọn mã", text: "Kiểm tra thông số, đề xuất mã phù hợp hoặc tương đương." },
  { title: "Nhận báo giá", text: "Đơn giá, thời gian giao hàng, bảo hành rõ ràng." },
  { title: "Giao hàng", text: "Đóng gói cẩn thận, giao tận nhà máy." },
];

/** How many product groups the home page shows before “Xem tất cả”. */
const HOME_GROUPS = 8;

export default async function HomePage() {
  const [settings, categories, brands, posts, banners, allProducts, pairs] = await Promise.all([
    getSettings(),
    getCategories(),
    getBrands(),
    getPosts({ limit: 3 }),
    getBanners(),
    getProducts({ limit: 200 }),
    getProductPairs(),
  ]);
  const tree = buildCategoryTree(categories);
  // "Sản phẩm chúng tôi cung cấp": main brands and product types that actually have products.
  const brandCount = countByBrand(pairs);
  const catCount = countByCategory(tree, pairs);
  const shopBrands = featuredBrands(brands).filter((b) => (brandCount.get(b.slug) ?? 0) > 0);
  const shopGroups = nonEmptyTree(tree, catCount);
  const otherBrands = brands.filter((b) => !shopBrands.some((x) => x.slug === b.slug));

  // Featured products, with one tab per group that has any (featured first, then newest).
  const groupOf = new Map<string, string>();
  for (const g of tree) {
    groupOf.set(g.slug, g.slug);
    g.children.forEach((c) => groupOf.set(c.slug, g.slug));
  }
  // Real photos first (featured before the rest), drawn placeholders (/demo/…) last, so the showcase looks consistent.
  const rank = (p: (typeof allProducts)[number]) => (p.image_url && !p.image_url.startsWith("/demo/") ? 2 : 0) + (p.featured ? 1 : 0);
  const ordered = [...allProducts].sort((a, b) => rank(b) - rank(a));
  const tabs = tree
    .map((g) => ({ slug: g.slug, name: g.name, items: ordered.filter((p) => p.category && groupOf.get(p.category.slug) === g.slug) }))
    .filter((t) => t.items.length > 0)
    .slice(0, 6);

  return (
    <>
      {/* ---------------------------------------------------------------- 1. Hero */}
      <HeroSlider
        banners={banners}
        tagline={settings.tagline}
        phone={settings.phone}
        phoneHref={settings.phone ? phoneDigits(settings.phone) : null}
        stats={[
          { value: `${brands.length}+`, label: "Thương hiệu" },
          { value: `${shopGroups.length}`, label: "Nhóm sản phẩm" },
          { value: "Miễn phí", label: "Tư vấn chọn mã" },
        ]}
      />

      {/* ----------------------------------------------------- 2. Brands */}
      {/* Main brands as large, still logos on a card that overlaps the hero; the other brands keep
          scrolling in full colour underneath (the owner asked for the coloured scrolling strip). */}
      <section className="relative z-10 border-b border-slate-200 bg-white pt-px pb-6" aria-label="Thương hiệu phân phối">
        <div className="container-page">
          <div className="-mt-12 rounded-3xl bg-white p-4 shadow-2xl shadow-steel-900/15 ring-1 ring-slate-200 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-bold tracking-widest text-brand-600 uppercase">
                  Cung cấp thiết bị {brands.length >= 20 ? `hơn ${Math.floor(brands.length / 10) * 10}` : brands.length} hãng
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-steel-900 sm:text-2xl">Thương hiệu tiêu biểu</h2>
              </div>
              <Link href="/thuong-hieu" className="text-sm font-semibold text-steel-600 hover:text-brand-600">Xem tất cả {brands.length} hãng →</Link>
            </div>
            <ul className="mt-4 grid grid-cols-4 gap-2 sm:mt-5 sm:gap-3 lg:grid-cols-8">
              {shopBrands.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/san-pham?thuong-hieu=${b.slug}`}
                    title={b.name}
                    className="group flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 px-1.5 py-2.5 transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-lg sm:rounded-2xl sm:px-3 sm:py-4"
                  >
                    <span className="flex h-8 w-full items-center justify-center sm:h-12">
                      <BrandLogo brand={b} className="max-h-8 sm:max-h-12" eager />
                    </span>
                    <span className="hidden text-[11px] font-semibold text-slate-500 transition group-hover:text-brand-600 sm:block lg:opacity-0 lg:group-hover:opacity-100">
                      {brandCount.get(b.slug)} sản phẩm →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container-page mt-6 flex items-center gap-4">
          <span className="hidden shrink-0 text-xs font-bold tracking-widest text-slate-400 uppercase sm:block">Và các hãng khác</span>
          <div className="group relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            {/* ~5 s per logo keeps the strip slow and readable however many brands there are */}
            <div
              className="animate-marquee flex w-max items-center gap-4 group-hover:[animation-play-state:paused]"
              style={{ animationDuration: `${Math.max(60, otherBrands.length * 5)}s` }}
            >
              {[...otherBrands, ...otherBrands].map((b, i) => (
                <Link
                  key={`${b.slug}-${i}`}
                  href={`/san-pham?thuong-hieu=${b.slug}`}
                  className="flex h-10 w-32 shrink-0 items-center justify-center px-3 transition hover:scale-105"
                  title={b.name}
                  tabIndex={i >= otherBrands.length ? -1 : undefined}
                  aria-hidden={i >= otherBrands.length || undefined}
                >
                  <BrandLogo brand={b} className="max-h-8" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ 3. About (showcase) */}
      {/* Light section (the hero above is dark): photo bento on the left, story + strengths on the right. */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-16 lg:py-24">
        <div
          className="absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
          style={{ backgroundImage: "radial-gradient(rgb(36 59 97 / 0.12) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div className="absolute -top-24 -right-24 -z-10 h-80 w-80 rounded-full bg-brand-100/60 blur-3xl" />

        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Story */}
          <Reveal className="lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold tracking-wider text-brand-700 uppercase ring-1 ring-brand-100">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" /> Về chúng tôi
            </span>
            <h2 className="mt-4 text-3xl leading-tight font-extrabold tracking-tight text-balance text-steel-900 sm:text-4xl lg:text-[2.75rem]">
              Đối tác vật tư <span className="text-brand-600">tin cậy</span> cho mọi nhà máy
            </h2>
            <p className="mt-4 line-clamp-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">{settings.about}</p>

            <ul className="mt-7 grid grid-cols-2 gap-3">
              {strengths.map((s) => (
                <li key={s.title} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-brand-500/40 hover:shadow-md sm:items-start sm:p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 sm:h-10 sm:w-10">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm leading-snug font-semibold text-steel-900 sm:text-base">{s.title}</span>
                    <span className="mt-0.5 hidden text-sm leading-snug text-slate-500 sm:block">{s.text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/gioi-thieu" className="btn-primary px-6 py-3 text-base">
                Tìm hiểu về {settings.short_name} <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/thuong-hieu" className="btn-outline px-6 py-3 text-base">
                Thương hiệu phân phối
              </Link>
            </div>
          </Reveal>

          {/* Photo bento + stats */}
          <Reveal delay={120} className="relative lg:order-1">
            <div className="grid h-[380px] grid-cols-6 grid-rows-6 gap-3 sm:h-[480px]">
              <div className="col-span-4 row-span-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/banner/dong-co.jpg" alt="Động cơ điện công nghiệp" loading="lazy" className="h-full w-full object-contain p-4" />
              </div>
              <div className="col-span-2 row-span-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/banner/nguon.jpg" alt="Bộ nguồn công nghiệp" loading="lazy" className="h-full w-full object-contain p-2" />
              </div>
              <div className="col-span-2 row-span-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/banner/khoi-dong-mem.jpg" alt="Khởi động mềm" loading="lazy" className="h-full w-full object-contain p-2" />
              </div>
              <dl className="relative col-span-6 row-span-2 grid grid-cols-3 items-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-600/25">
                <Gear teeth={12} className="animate-spin-slow absolute -right-8 -bottom-10 h-36 w-36 text-white/10" />
                {[
                  { value: brands.length, suffix: "+", label: "Thương hiệu" },
                  { value: shopGroups.length, suffix: "", label: "Nhóm hàng" },
                  { value: pairs.length, suffix: "+", label: "Sản phẩm" },
                ]
                  .filter((x) => x.value > 0)
                  .map((x) => (
                    <div key={x.label} className="relative flex flex-col-reverse text-center">
                      <dt className="mt-0.5 text-xs text-white/80 sm:text-sm">{x.label}</dt>
                      <dd className="text-3xl font-black sm:text-4xl">
                        <CountUp value={x.value} suffix={x.suffix} />
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>

            {/* Rotating badge where the photos meet */}
            <div className="absolute top-[52%] left-[66%] flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-steel-900 shadow-xl ring-8 ring-white sm:h-28 sm:w-28">
              <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <path id="about-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text fontSize="8" fontWeight="700" letterSpacing="1.6" fill="white">
                  <textPath href="#about-circle">{`${settings.short_name.toUpperCase()} • SPARE PARTS FACTORY 24H • `}</textPath>
                </text>
              </svg>
              <span className="flex h-[58%] w-[58%] items-center justify-center rounded-full bg-white p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-dat-danh-mark.png" alt="" className="w-full" />
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------- 4. Shop by product type (brands are in section 2) */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Loại hàng" title="Sản phẩm chúng tôi cung cấp" href="/san-pham" linkLabel="Xem tất cả sản phẩm →" />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {shopGroups.slice(0, HOME_GROUPS).map((g, i) => (
            <Reveal key={g.slug} delay={(i % 4) * 60}>
              <Link
                href={`/danh-muc-san-pham/${g.slug}`}
                className="group flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-lg"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                  {g.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={categoryThumb(g.image_url)} alt="" loading="lazy" className="h-full w-full object-contain p-1 transition duration-500 group-hover:scale-105" />
                  ) : (
                    <Icon name={g.icon ?? "box"} className="h-7 w-7 text-steel-600" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm leading-snug font-semibold text-slate-900 group-hover:text-brand-600">{g.name}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{catCount.get(g.slug)} sản phẩm</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        {shopGroups.length > HOME_GROUPS && (
          <div className="mt-6 text-center">
            <Link href="/san-pham" className="inline-block py-2 text-sm font-semibold text-steel-600 hover:text-brand-600">
              Xem tất cả {shopGroups.length} loại hàng →
            </Link>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------- 5. Featured (tabs) */}
      {tabs.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container-page">
            <SectionHeading eyebrow="Sản phẩm" title="Sản phẩm nổi bật" />
            <Reveal className="mt-8">
              <ProductTabs all={ordered} tabs={tabs} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------------------------------------------- 6. Quote in 4 steps (CTA) */}
      {/* Right after the products, where the visitor is most likely to ask for a price. */}
      <section className="container-page py-16">
        <Reveal>
          <div className="grid items-center gap-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="text-sm font-semibold tracking-wider text-steel-600 uppercase">Báo giá nhanh</p>
              <h2 className="mt-1 text-3xl font-bold text-balance text-steel-900 sm:text-4xl">Nhận báo giá chỉ với 4 bước</h2>
              <p className="mt-3 text-slate-600">Gửi danh sách mã hàng hoặc ảnh tem nhãn — chúng tôi tư vấn và báo giá cho bạn.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <Link href="/lien-he" className="btn-primary col-span-2 px-6 py-3 text-base">
                  Gửi yêu cầu báo giá <Icon name="arrow" className="h-4 w-4" />
                </Link>
                {settings.phone && (
                  <a href={`tel:${phoneDigits(settings.phone)}`} className="btn-outline px-3 py-3 text-sm whitespace-nowrap sm:px-6 sm:text-base">
                    <Icon name="phone" className="h-4 w-4" /> {settings.phone}
                  </a>
                )}
                {settings.zalo && (
                  <a href={`https://zalo.me/${phoneDigits(settings.zalo)}`} target="_blank" rel="noopener noreferrer" className="btn-outline px-3 py-3 text-sm whitespace-nowrap sm:px-6 sm:text-base">
                    Chat Zalo
                  </a>
                )}
              </div>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-steel-900 font-extrabold text-white">{i + 1}</span>
                  <span>
                    <span className="block font-semibold text-slate-900">{s.title}</span>
                    <span className="mt-0.5 block text-sm text-slate-500">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      {/* ----------------------------------------------------------------- 7. News */}
      {posts.length > 0 && (
        <section className="container-page pt-16">
          <SectionHeading eyebrow="Tin tức" title="Kiến thức & tin tức" href="/tin-tuc" />
          <div className="-mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 100} className="w-72 shrink-0 snap-start md:w-auto">
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

    </>
  );
}

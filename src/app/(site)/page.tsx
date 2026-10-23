import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { CountUp } from "@/components/CountUp";
import { HeroSlider } from "@/components/HeroSlider";
import { Icon } from "@/components/Icon";
import { PostCard } from "@/components/PostCard";
import { ProductTabs } from "@/components/ProductTabs";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { buildCategoryTree, getBanners, getBrands, getCategories, getPosts, getProducts, getSettings } from "@/lib/data";
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

/** Where the four benefit chips float around the About collage. */
const chipPos = [
  "top-0 right-0 sm:-right-4",
  "top-[45%] -left-2 sm:-left-8",
  "right-0 bottom-0 sm:-right-6",
  "-bottom-4 left-4 sm:left-10",
];

/** How many product groups the home page shows before “Xem tất cả”. */
const HOME_GROUPS = 8;

export default async function HomePage() {
  const [settings, categories, brands, posts, banners, allProducts] = await Promise.all([
    getSettings(),
    getCategories(),
    getBrands(),
    getPosts({ limit: 3 }),
    getBanners(),
    getProducts({ limit: 200 }),
  ]);
  const tree = buildCategoryTree(categories);
  const subNames = tree.flatMap((g) => g.children.map((c) => c.name));
  // Second marquee row: sub-categories, or the groups if there are none yet.
  const keywords = subNames.length ? subNames : tree.map((g) => g.name);

  // Featured products, with one tab per group that has any (featured first, then newest).
  const groupOf = new Map<string, string>();
  for (const g of tree) {
    groupOf.set(g.slug, g.slug);
    g.children.forEach((c) => groupOf.set(c.slug, g.slug));
  }
  const ordered = [...allProducts.filter((p) => p.featured), ...allProducts.filter((p) => !p.featured)];
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
          { value: `${tree.length}`, label: "Nhóm sản phẩm" },
          { value: "Miễn phí", label: "Tư vấn chọn mã" },
        ]}
      />

      {/* ----------------------------------------------------- 2. Brand marquee */}
      {/* Keep this section: the owner asked for the full-colour scrolling brand strip on the home page. */}
      <section className="border-b border-slate-200 bg-white py-6" aria-label="Thương hiệu phân phối">
        <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-6 group-hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((b, i) => (
              <Link
                key={`${b.slug}-${i}`}
                href={`/san-pham?thuong-hieu=${b.slug}`}
                className="flex h-14 w-40 shrink-0 items-center justify-center px-4 transition hover:scale-105"
                title={b.name}
                tabIndex={i >= brands.length ? -1 : undefined}
                aria-hidden={i >= brands.length || undefined}
              >
                <BrandLogo brand={b} className="max-h-10" eager />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 3. Categories */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Danh mục" title="Sản phẩm chúng tôi cung cấp" href="/san-pham" linkLabel={`Xem tất cả ${tree.length} nhóm →`} />
        {/* Mobile: one swipeable row · Desktop: 4 × 2 grid — every tile in the same style */}
        <div className="-mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {tree.slice(0, HOME_GROUPS).map((g, i) => (
            <Reveal key={g.slug} delay={(i % 4) * 60} className="w-44 shrink-0 snap-start sm:w-auto">
              <Link
                href={`/danh-muc-san-pham/${g.slug}`}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-lg sm:flex-row sm:items-center"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-steel-50 text-steel-600 transition group-hover:bg-steel-900 group-hover:text-white">
                  <Icon name={g.icon ?? "box"} className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-slate-900">{g.name}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{g.children.length} danh mục</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link href="/san-pham" className="text-sm font-semibold text-steel-600">Xem tất cả {tree.length} nhóm →</Link>
        </div>
      </section>

      {/* ------------------------------------------------------- 4. Featured (tabs) */}
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

      {/* ---------------------------------------------- 5. Quote in 4 steps (CTA) */}
      {/* Right after the products, where the visitor is most likely to ask for a price. */}
      <section className="container-page py-16">
        <Reveal>
          <div className="grid items-center gap-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="text-sm font-semibold tracking-wider text-steel-600 uppercase">Báo giá nhanh</p>
              <h2 className="mt-1 text-3xl font-bold text-steel-900 sm:text-4xl">Nhận báo giá chỉ với 4 bước</h2>
              <p className="mt-3 text-slate-600">Gửi danh sách mã hàng hoặc ảnh tem nhãn — chúng tôi tư vấn và báo giá cho bạn.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/lien-he" className="btn-primary px-6 py-3 text-base">
                  Gửi yêu cầu báo giá <Icon name="arrow" className="h-4 w-4" />
                </Link>
                {settings.phone && (
                  <a href={`tel:${phoneDigits(settings.phone)}`} className="btn-outline px-6 py-3 text-base">
                    <Icon name="phone" className="h-4 w-4" /> {settings.phone}
                  </a>
                )}
                {settings.zalo && (
                  <a href={`https://zalo.me/${phoneDigits(settings.zalo)}`} target="_blank" rel="noopener noreferrer" className="btn-outline px-6 py-3 text-base">
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

      {/* ------------------------------------------------------ 6. About (showcase) */}
      <section className="relative isolate overflow-hidden bg-steel-900 py-16 text-white lg:py-24">
        <div className="bg-blueprint absolute inset-0 -z-10" />
        <div className="absolute top-1/3 -left-40 -z-10 h-[480px] w-[480px] rounded-full bg-steel-500/30 blur-3xl" />
        <div className="absolute -right-40 bottom-0 -z-10 h-[520px] w-[520px] rounded-full bg-brand-600/30 blur-3xl" />

        {/* Kinetic keyword strip */}
        <div aria-hidden="true" className="space-y-2 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="animate-marquee flex w-max gap-8 text-5xl font-black whitespace-nowrap uppercase lg:text-7xl">
            {[...tree, ...tree].map((g, i) => (
              <span key={`a${i}`} className="text-outline flex items-center gap-8">
                {g.name} <span className="text-brand-500 [-webkit-text-stroke:0]">✦</span>
              </span>
            ))}
          </div>
          <div className="animate-marquee-reverse flex w-max gap-6 text-lg font-bold whitespace-nowrap text-steel-100/30 uppercase lg:text-2xl">
            {[...keywords, ...keywords].map((n, i) => (
              <span key={`b${i}`} className="flex items-center gap-6">
                {n} <span className="text-steel-100/20">/</span>
              </span>
            ))}
          </div>
        </div>

        <div className="container-page mt-14 grid items-center gap-14 lg:mt-20 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" /> Về chúng tôi
            </span>
            <h2 className="mt-5 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
              Đối tác vật tư{" "}
              <span className="bg-gradient-to-r from-brand-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">tin cậy</span>
              <br />
              cho mọi nhà máy
            </h2>
            <p className="mt-5 line-clamp-3 max-w-xl text-lg leading-relaxed text-steel-100/80">{settings.about}</p>

            <dl className="mt-8 grid max-w-lg grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              {[
                { value: brands.length, suffix: "+", label: "Thương hiệu" },
                { value: tree.length, suffix: "", label: "Nhóm hàng" },
                { value: subNames.length, suffix: "+", label: "Danh mục" },
              ]
                .filter((s) => s.value > 0)
                .map((s) => (
                <div key={s.label} className="flex flex-col-reverse px-4 py-4 text-center sm:px-6">
                  <dt className="mt-1 text-xs text-steel-100/70 sm:text-sm">{s.label}</dt>
                  <dd className="bg-gradient-to-b from-white to-steel-100/70 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/gioi-thieu" className="btn bg-white px-6 py-3 text-base text-steel-900 hover:bg-steel-50">
                Tìm hiểu về {settings.short_name} <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/thuong-hieu" className="btn border border-white/25 px-6 py-3 text-base text-white hover:bg-white/10">
                Thương hiệu phân phối
              </Link>
            </div>
          </Reveal>

          {/* Tilted collage with floating benefit chips */}
          <Reveal delay={150} className="relative mx-auto hidden h-[460px] w-full max-w-[540px] sm:block">
            <div className="animate-float absolute top-4 left-2 w-[62%] -rotate-6 overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl shadow-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demo/motor-giam-toc.svg" alt="" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div
              className="animate-float absolute right-2 bottom-6 w-[58%] rotate-[5deg] overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl shadow-black/40"
              style={{ animationDelay: "-3s" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demo/van-dien-tu.svg" alt="" className="aspect-[4/3] w-full object-cover" />
            </div>

            {/* Rotating badge */}
            <div className="absolute top-[38%] left-[46%] flex h-28 w-28 -translate-x-1/2 items-center justify-center rounded-full bg-brand-600 shadow-xl shadow-brand-600/40 ring-8 ring-steel-900 sm:h-32 sm:w-32">
              <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <path id="about-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text fontSize="8" fontWeight="700" letterSpacing="1.6" fill="white">
                  <textPath href="#about-circle">{`${settings.short_name.toUpperCase()} • SPARE PARTS FACTORY 24H • `}</textPath>
                </text>
              </svg>
              <span className="flex h-[60%] w-[60%] items-center justify-center rounded-full bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-dat-danh-mark.png" alt="" className="w-full" />
              </span>
            </div>

            {strengths.map((s, i) => (
              <div
                key={s.title}
                className={`animate-float absolute z-10 flex items-center gap-2.5 rounded-2xl border border-white/15 bg-steel-900/90 px-3.5 py-2.5 text-sm font-semibold shadow-xl shadow-black/30 backdrop-blur-md ${chipPos[i]}`}
                style={{ animationDelay: `${-i * 1.5}s` }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-steel-900">
                  <Icon name={s.icon} className="h-4 w-4" />
                </span>
                {s.title}
              </div>
            ))}
          </Reveal>

          <ul className="grid grid-cols-2 gap-3 sm:hidden">
            {strengths.map((s) => (
              <li key={s.title} className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-semibold">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-steel-900">
                  <Icon name={s.icon} className="h-4 w-4" />
                </span>
                {s.title}
              </li>
            ))}
          </ul>
        </div>
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

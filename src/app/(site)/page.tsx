import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { CategoryMenu } from "@/components/CategoryMenu";
import { CtaBanner } from "@/components/CtaBanner";
import { Gear } from "@/components/Gear";
import { HeroSlider } from "@/components/HeroSlider";
import { Icon } from "@/components/Icon";
import { PostCard } from "@/components/PostCard";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { buildCategoryTree, getBanners, getBrands, getCategories, getPosts, getProducts, getServices, getSettings } from "@/lib/data";
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



export default async function HomePage() {
  const [settings, categories, brands, featured, services, posts, banners] = await Promise.all([
    getSettings(),
    getCategories(),
    getBrands(),
    getProducts({ featured: true, limit: 8 }),
    getServices(),
    getPosts({ limit: 3 }),
    getBanners(),
  ]);
  const tree = buildCategoryTree(categories);

  // "Products by category" blocks: every group that has products, up to 4 each.
  const allProducts = await getProducts({ limit: 200 });
  const groupOf = new Map<string, string>();
  for (const g of tree) {
    groupOf.set(g.slug, g.slug);
    g.children.forEach((c) => groupOf.set(c.slug, g.slug));
  }
  const productBlocks = tree
    .map((g) => ({ group: g, items: allProducts.filter((p) => p.category && groupOf.get(p.category.slug) === g.slug).slice(0, 4) }))
    .filter((b) => b.items.length > 0);


  return (
    <>
      {/* ------------------------------------------- Category menu + hero slider */}
      <section className="bg-gradient-to-b from-slate-100 to-white pt-4 pb-2 lg:pt-6">
        <div className="container-page grid gap-4 lg:grid-cols-[280px_1fr]">
          <CategoryMenu tree={tree} />
          <HeroSlider
            boxed
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
        </div>
      </section>

      {/* ------------------------------------------------------------ Brand marquee */}
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

      {/* ------------------------------------------------------------- About intro */}
      <section className="container-page grid items-center gap-12 py-16 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <div className="absolute -inset-4 -z-10 -rotate-2 rounded-[2rem] bg-gradient-to-br from-steel-100 to-brand-100" />
          <div className="grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demo/van-dien-tu.svg" alt="" className="col-span-2 aspect-[2/1] w-full rounded-3xl object-cover shadow-xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demo/aptomat.svg" alt="" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demo/motor-giam-toc.svg" alt="" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg" />
          </div>
        </Reveal>
        <Reveal delay={120} className="order-1 lg:order-2">
          <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">Về chúng tôi</p>
          <h2 className="mt-1 text-3xl font-bold text-steel-900 sm:text-4xl">
            Chào mừng đến với <span className="text-brand-600">{settings.short_name}</span>
          </h2>
          <p className="mt-2 text-sm font-semibold tracking-wide text-steel-600 uppercase">{settings.company_name}</p>
          <p className="mt-5 line-clamp-6 leading-relaxed text-slate-600">{settings.about}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Thiết bị từ các thương hiệu uy tín", "Tư vấn chọn mã, tìm mã tương đương", "Báo giá nhanh theo danh sách", "Giao hàng tận nơi"].map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Link href="/gioi-thieu" className="btn-secondary mt-8 px-6 py-3">
            Xem thêm về chúng tôi <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </Reveal>
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
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {tree.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 6) * 60}>
              <Link
                href={`/danh-muc-san-pham/${c.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-xl hover:shadow-steel-900/10"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-steel-50 to-slate-100">
                  {c.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image_url} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm transition group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                      <Icon name={c.icon ?? "box"} className="h-8 w-8" />
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3.5">
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand-600">{c.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{c.children.map((x) => x.name).join(" · ")}</p>
                </div>
              </Link>
            </Reveal>
          ))}
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

      {/* ------------------------------------------------- Products by category */}
      {productBlocks.length > 0 && (
        <section className="container-page space-y-10 py-16">
          <SectionHeading eyebrow="Sản phẩm" title="Sản phẩm theo danh mục" href="/san-pham" />
          {productBlocks.map(({ group, items }) => (
            <Reveal key={group.slug}>
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
                  <h3 className="flex items-center gap-2.5 text-lg font-bold text-steel-900">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                      <Icon name={group.icon ?? "box"} className="h-5 w-5" />
                    </span>
                    {group.name}
                  </h3>
                  <div className="flex flex-1 flex-wrap gap-2">
                    {group.children.slice(0, 6).map((c) => (
                      <Link
                        key={c.slug}
                        href={`/danh-muc-san-pham/${c.slug}`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-brand-500 hover:text-brand-600"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                  <Link href={`/danh-muc-san-pham/${group.slug}`} className="text-sm font-semibold text-brand-600 hover:underline">
                    Xem tất cả →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </section>
      )}

      {/* ---------------------------------------------------------------- Services */}
      {services.length > 0 && (
        <section className="container-page py-16">
          <SectionHeading eyebrow="Dịch vụ" title="Dịch vụ của chúng tôi" href="/dich-vu" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 80}>
                <Link
                  href={`/dich-vu#${s.slug}`}
                  className="group block h-full rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:bg-gradient-to-br hover:from-white hover:to-brand-50 hover:shadow-xl hover:shadow-steel-900/10"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-steel-900 text-white transition group-hover:bg-brand-600">
                    <Icon name={s.icon ?? "cog"} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                  {s.summary && <p className="mt-1 line-clamp-3 text-sm text-slate-500">{s.summary}</p>}
                </Link>
              </Reveal>
            ))}
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

      {/* -------------------------------------------------------------------- News */}
      {posts.length > 0 && (
        <section className="container-page pt-16">
          <SectionHeading eyebrow="Tin tức" title="Kiến thức & tin tức" description="Hướng dẫn chọn thiết bị, mẹo kỹ thuật và tin tức mới." href="/tin-tuc" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* --------------------------------------------------------------------- CTA */}
      <section className="container-page pt-16">
        <CtaBanner title="Liên hệ ngay để được tư vấn & báo giá" phone={settings.phone} zalo={settings.zalo} />
      </section>
    </>
  );
}

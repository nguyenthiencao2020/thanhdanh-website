import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Gear } from "@/components/Gear";
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

      {/* ------------------------------------------- 6. About + why us  */}
      <section className="relative isolate overflow-hidden bg-steel-900 py-16 text-white">
        <div className="bg-blueprint absolute inset-0 -z-10" />
        <Gear teeth={16} className="animate-spin-slow absolute -right-32 -bottom-32 -z-10 h-[420px] w-[420px] text-white/10" />
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <p className="text-sm font-semibold tracking-wider text-steel-100/70 uppercase">Về chúng tôi</p>
            <h2 className="mt-1 text-3xl font-bold sm:text-4xl">Đối tác vật tư tin cậy cho nhà máy</h2>
            <p className="mt-4 line-clamp-4 leading-relaxed text-steel-100/85">{settings.about}</p>
            <Link href="/gioi-thieu" className="mt-6 inline-flex items-center gap-1 font-semibold text-white underline-offset-4 hover:underline">
              Tìm hiểu về {settings.short_name} <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            {strengths.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="flex h-full gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <Icon name={s.icon} className="h-6 w-6 shrink-0 text-steel-100" />
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-steel-100/75">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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

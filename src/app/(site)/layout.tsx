import { BackToTop } from "@/components/BackToTop";
import { FloatingContact } from "@/components/FloatingContact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileActionBar } from "@/components/MobileActionBar";
import { countByBrand, countByCategory, featuredBrands, nonEmptyTree } from "@/lib/catalog";
import { buildCategoryTree, getBrands, getCategories, getPages, getProductPairs, getSettings } from "@/lib/data";
import { resolveMapEmbed } from "@/lib/maps";
import { phoneDigits } from "@/lib/utils";

export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, pages, brands, pairs] = await Promise.all([getSettings(), getCategories(), getPages(), getBrands(), getProductPairs()]);
  // Menus only show groups and brands that have products.
  const catCount = countByCategory(buildCategoryTree(categories), pairs);
  const tree = nonEmptyTree(buildCategoryTree(categories), catCount);
  const brandCount = countByBrand(pairs);
  const menuBrands = featuredBrands(brands)
    .filter((b) => (brandCount.get(b.slug) ?? 0) > 0)
    .map((b) => ({ slug: b.slug, name: b.name, logo_url: b.logo_url, count: brandCount.get(b.slug) ?? 0 }));
  return (
    <>
      {/* Keyboard users: jump past the top bar and menu. Visible only when focused. */}
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-brand-700 focus:shadow-lg focus:ring-2 focus:ring-brand-600"
      >
        Bỏ qua tới nội dung
      </a>
      <Header
        shortName={settings.short_name}
        tagline={settings.tagline}
        announcement={settings.announcement}
        announcementUrl={settings.announcement_url}
        phone={settings.phone}
        phoneHref={settings.phone ? phoneDigits(settings.phone) : null}
        email={settings.email}
        zaloHref={settings.zalo ? `https://zalo.me/${phoneDigits(settings.zalo)}` : null}
        facebook={settings.facebook}
        categories={tree.map((g) => ({ ...g, count: catCount.get(g.slug) ?? 0 }))}
        brands={menuBrands}
      />
      <main id="noi-dung" tabIndex={-1} className="overflow-x-clip outline-none">{children}</main>
      <Footer settings={{ ...settings, map_embed_url: await resolveMapEmbed(settings.map_embed_url, settings.address) }} categories={tree} pages={pages} />
      <FloatingContact phone={settings.phone} zalo={settings.zalo} messenger={settings.messenger_url} />
      <BackToTop />
      <MobileActionBar
        phoneHref={settings.phone ? phoneDigits(settings.phone) : null}
        zaloHref={settings.zalo ? `https://zalo.me/${phoneDigits(settings.zalo)}` : null}
      />
    </>
  );
}

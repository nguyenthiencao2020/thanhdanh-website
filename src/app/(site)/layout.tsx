import { AnnouncementBar } from "@/components/AnnouncementBar";
import { BackToTop } from "@/components/BackToTop";
import { FloatingContact } from "@/components/FloatingContact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCategories, getPages, getSettings } from "@/lib/data";
import { phoneDigits } from "@/lib/utils";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, pages] = await Promise.all([getSettings(), getCategories(), getPages()]);
  return (
    <>
      {settings.announcement && <AnnouncementBar text={settings.announcement} href={settings.announcement_url} />}
      <Header
        shortName={settings.short_name}
        tagline={settings.tagline}
        phone={settings.phone}
        phoneHref={settings.phone ? phoneDigits(settings.phone) : null}
        email={settings.email}
        zaloHref={settings.zalo ? `https://zalo.me/${phoneDigits(settings.zalo)}` : null}
        facebook={settings.facebook}
        categories={categories}
      />
      <main className="overflow-x-clip">{children}</main>
      <Footer settings={settings} categories={categories} pages={pages} />
      <FloatingContact phone={settings.phone} zalo={settings.zalo} messenger={settings.messenger_url} />
      <BackToTop />
    </>
  );
}

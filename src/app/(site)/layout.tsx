import { FloatingContact } from "@/components/FloatingContact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCategories, getSettings } from "@/lib/data";
import { phoneDigits } from "@/lib/utils";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  return (
    <>
      <Header
        shortName={settings.short_name}
        tagline={settings.tagline}
        phone={settings.phone}
        phoneHref={settings.phone ? phoneDigits(settings.phone) : null}
        categories={categories}
      />
      <main>{children}</main>
      <Footer settings={settings} categories={categories} />
      <FloatingContact phone={settings.phone} zalo={settings.zalo} />
    </>
  );
}

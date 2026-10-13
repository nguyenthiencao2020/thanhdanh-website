import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { getSettings } from "@/lib/data";
import "./globals.css";

const font = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: `${s.short_name} – ${s.tagline ?? "Vật tư nhà máy"}`, template: `%s | ${s.short_name}` },
    description: s.about?.slice(0, 160) ?? undefined,
    openGraph: { type: "website", locale: "vi_VN", siteName: s.company_name, images: ["/logo.png"] },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={font.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

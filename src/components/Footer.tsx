import Link from "next/link";
import type { Category, Page, Settings } from "@/lib/types";
import { phoneDigits } from "@/lib/utils";
import { BrandMark } from "./BrandMark";
import { FooterCol } from "./FooterCol";
import { Icon } from "./Icon";

const companyLinks = [
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/thuong-hieu", label: "Thương hiệu" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ – Báo giá" },
];

export function Footer({ settings, categories, pages }: { settings: Settings; categories: Category[]; pages: Page[] }) {
  const year = new Date().getFullYear();
  const phones = [settings.phone, settings.phone2].filter((p): p is string => Boolean(p));
  const link = "text-steel-100/80 transition hover:text-white";

  return (
    <footer className="relative mt-16 overflow-hidden bg-steel-900 text-steel-100">
      <div className="bg-blueprint absolute inset-0 opacity-50" />

      {/* Quick-contact band */}
      <div className="relative border-b border-white/10">
        <div className="container-page flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xl font-extrabold text-white sm:text-2xl">Cần báo giá vật tư gấp?</p>
            <p className="mt-1 text-sm text-steel-100/80">Gửi mã hàng hoặc ảnh tem nhãn — phản hồi nhanh trong giờ làm việc.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {phones.map((p) => (
              <a
                key={p}
                href={`tel:${phoneDigits(p)}`}
                className="flex items-center gap-2.5 rounded-xl bg-brand-600 px-4 py-2.5 text-base font-bold text-white shadow-lg shadow-black/20 transition hover:bg-brand-500"
              >
                <Icon name="phone" className="h-4 w-4" /> {p}
              </a>
            ))}
            {settings.zalo && (
              <a
                href={`https://zalo.me/${phoneDigits(settings.zalo)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl bg-white/10 px-4 py-2.5 text-base font-bold text-white ring-1 ring-white/15 transition hover:bg-white/20"
              >
                <span className="rounded-md bg-[#0068ff] px-1.5 py-0.5 text-[10px] leading-none">Zalo</span> Chat Zalo
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="relative container-page grid gap-x-10 py-12 lg:grid-cols-12 lg:gap-y-10 lg:py-14">
        {/* Brand */}
        <div className="pb-6 lg:col-span-4 lg:pb-0">
          <Link href="/" className="inline-block rounded-2xl bg-white p-4 shadow-xl shadow-black/20" aria-label={`${settings.short_name} – Trang chủ`}>
            <BrandMark name={settings.short_name} className="h-auto w-52 sm:w-60" />
          </Link>
          {settings.tagline && <p className="mt-5 font-semibold text-white">{settings.tagline}</p>}
          <ul className="mt-4 space-y-3 text-sm">
            {settings.address && (
              <li className="flex gap-3"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" /> {settings.address}</li>
            )}
            {settings.business_hours && (
              <li className="flex gap-3"><Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" /> {settings.business_hours}</li>
            )}
            {settings.email && (
              <li className="flex gap-3">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" />
                <a href={`mailto:${settings.email}`} className={link}>{settings.email}</a>
              </li>
            )}
          </ul>
        </div>

        {/* Products */}
        <FooterCol title="Sản phẩm" className="lg:col-span-3">
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/danh-muc-san-pham/${c.slug}`} className={link}>{c.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/san-pham" className="font-semibold text-white hover:text-brand-100">Xem tất cả danh mục →</Link>
            </li>
          </ul>
        </FooterCol>

        {/* Company */}
        <FooterCol title="Đạt Danh" className="lg:col-span-2">
          <ul className="space-y-2.5 text-sm">
            {companyLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>
            ))}
          </ul>
        </FooterCol>

        {/* Policies + map */}
        <div className="lg:col-span-3">
          <FooterCol title="Chính sách">
            <ul className="space-y-2.5 text-sm">
              {pages.map((p) => (
                <li key={p.slug}><Link href={`/${p.slug}`} className={link}>{p.title}</Link></li>
              ))}
            </ul>
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/20">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1877f2] text-xs font-bold">f</span> Fanpage Facebook
              </a>
            )}
          </FooterCol>
          {settings.map_embed_url && (
            <iframe
              src={settings.map_embed_url}
              title="Bản đồ vị trí công ty"
              className="mt-6 h-44 w-full rounded-2xl border-0 bg-white/5 ring-1 ring-white/10 lg:h-40"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </div>

      {/* Legal */}
      <div className="relative border-t border-white/10 bg-black/15">
        <div className="container-page flex flex-col gap-3 pt-5 pb-24 text-xs text-steel-100/70 lg:flex-row lg:items-center lg:justify-between lg:pb-5">
          <div>
            <p className="font-semibold text-white uppercase">{settings.company_name}</p>
            {settings.english_name && <p className="mt-0.5 tracking-wide uppercase">{settings.english_name}</p>}
            <p className="mt-1">
              {settings.tax_code && <>MST: <span className="font-semibold text-steel-100">{settings.tax_code}</span></>}
              {settings.license_info && <> · {settings.license_info}</>}
            </p>
          </div>
          <span className="shrink-0">© {year} {settings.short_name}. Bảo lưu mọi quyền.</span>
        </div>
      </div>
    </footer>
  );
}

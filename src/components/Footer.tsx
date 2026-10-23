import Link from "next/link";
import type { Category, Page, Settings } from "@/lib/types";
import { phoneDigits } from "@/lib/utils";
import { BrandMark } from "./BrandMark";
import { Icon } from "./Icon";

export function Footer({ settings, categories, pages }: { settings: Settings; categories: Category[]; pages: Page[] }) {
  const year = new Date().getFullYear();
  const phones = [settings.phone, settings.phone2].filter((p): p is string => Boolean(p));
  const heading = "text-sm font-bold tracking-wider text-white uppercase";

  return (
    <footer className="relative mt-16 overflow-hidden bg-steel-900 text-steel-100">
      <div className="bg-blueprint absolute inset-0 opacity-50" />
      <div className="relative container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
        {/* Company */}
        <div className="lg:col-span-4">
          <div className="inline-flex rounded-2xl bg-white px-4 py-3">
            <BrandMark name={settings.short_name} subtitle="Factory Supplies" />
          </div>
          <p className="mt-5 font-bold text-white uppercase">{settings.company_name}</p>
          {settings.english_name && <p className="mt-1 text-xs tracking-wide text-steel-100/70 uppercase">{settings.english_name}</p>}
          {settings.tax_code && (
            <p className="mt-3 text-sm">
              <span className="font-semibold text-white">Mã số thuế: {settings.tax_code}</span>
              {settings.license_info && <span className="mt-0.5 block text-xs text-steel-100/70">{settings.license_info}</span>}
            </p>
          )}
          <ul className="mt-4 space-y-2.5 text-sm">
            {settings.address && (
              <li className="flex gap-3"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" /> {settings.address}</li>
            )}
            {settings.business_hours && (
              <li className="flex gap-3"><Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" /> {settings.business_hours}</li>
            )}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3">
          <p className={heading}>Liên hệ</p>
          <ul className="mt-4 space-y-3 text-sm">
            {phones.map((p) => (
              <li key={p}>
                <a href={`tel:${phoneDigits(p)}`} className="flex items-center gap-3 text-base font-bold text-white hover:text-brand-100">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600"><Icon name="phone" className="h-4 w-4" /></span>
                  {p}
                </a>
              </li>
            ))}
            {settings.email && (
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"><Icon name="mail" className="h-4 w-4" /></span>
                <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a>
              </li>
            )}
            {settings.zalo && (
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-steel-500 text-[10px] font-bold text-white">Zalo</span>
                <a href={`https://zalo.me/${phoneDigits(settings.zalo)}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Chat Zalo: {settings.zalo}
                </a>
              </li>
            )}
            {settings.facebook && (
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1877f2] text-xs font-bold text-white">f</span>
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">Fanpage Facebook</a>
              </li>
            )}
          </ul>
        </div>

        {/* Categories */}
        <div className="lg:col-span-2">
          <p className={heading}>Sản phẩm</p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/danh-muc-san-pham/${c.slug}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
            <li><Link href="/thuong-hieu" className="hover:text-white">Thương hiệu</Link></li>
          </ul>
        </div>

        {/* Policies & info */}
        <div className="lg:col-span-3">
          <p className={heading}>Chính sách</p>
          <ul className="mt-4 space-y-2 text-sm">
            {pages.map((p) => (
              <li key={p.slug}><Link href={`/${p.slug}`} className="hover:text-white">{p.title}</Link></li>
            ))}
          </ul>
          <p className={`${heading} mt-6`}>Thông tin</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/gioi-thieu" className="hover:text-white">Giới thiệu</Link></li>
            <li><Link href="/dich-vu" className="hover:text-white">Dịch vụ</Link></li>
            <li><Link href="/tin-tuc" className="hover:text-white">Tin tức</Link></li>
            <li><Link href="/lien-he" className="hover:text-white">Liên hệ – Báo giá</Link></li>
          </ul>
        </div>
      </div>

      {settings.map_embed_url && (
        <div className="relative container-page pb-10">
          <iframe
            src={settings.map_embed_url}
            title="Bản đồ vị trí công ty"
            className="h-56 w-full rounded-2xl border-0 opacity-90 grayscale-[30%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-steel-100/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {settings.company_name}. Bảo lưu mọi quyền.</span>
          <span>{settings.address}</span>
        </div>
      </div>
    </footer>
  );
}

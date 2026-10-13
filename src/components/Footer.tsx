import Link from "next/link";
import type { Category, Settings } from "@/lib/types";
import { phoneDigits } from "@/lib/utils";
import { Icon } from "./Icon";

export function Footer({ settings, categories }: { settings: Settings; categories: Category[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-steel-900 text-steel-100">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-lg font-bold text-white uppercase">{settings.company_name}</p>
          {settings.tagline && <p className="mt-1 text-sm text-brand-100">{settings.tagline}</p>}
          <ul className="mt-5 space-y-3 text-sm">
            {settings.address && (
              <li className="flex gap-3">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0" /> {settings.address}
              </li>
            )}
            {[settings.phone, settings.phone2].filter(Boolean).map((p) => (
              <li key={p} className="flex gap-3">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0" />
                <a href={`tel:${phoneDigits(p!)}`} className="font-semibold text-white hover:underline">
                  {p}
                </a>
              </li>
            ))}
            {settings.email && (
              <li className="flex gap-3">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:underline">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.business_hours && (
              <li className="flex gap-3">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0" /> {settings.business_hours}
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">Danh mục sản phẩm</p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/san-pham?danh-muc=${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">Thông tin</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/gioi-thieu" className="hover:text-white">Giới thiệu</Link></li>
            <li><Link href="/thuong-hieu" className="hover:text-white">Thương hiệu phân phối</Link></li>
            <li><Link href="/lien-he" className="hover:text-white">Liên hệ – Báo giá</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-4 text-xs text-steel-100/70">
          © {year} {settings.company_name}. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  );
}

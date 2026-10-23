"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "./BrandMark";
import { Icon } from "./Icon";

const nav = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/thuong-hieu", label: "Thương hiệu" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
];

type Props = {
  shortName: string;
  tagline: string | null;
  phone: string | null;
  phoneHref: string | null;
  categories: { slug: string; name: string }[];
};

export function Header({ shortName, tagline, phone, phoneHref, categories }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="hidden bg-steel-900 text-xs text-steel-100 sm:block">
        <div className="container-page flex h-9 items-center justify-between">
          <span>{tagline}</span>
          {phone && phoneHref && (
            <a href={`tel:${phoneHref}`} className="flex items-center gap-1.5 font-semibold text-white hover:underline">
              <Icon name="phone" className="h-3.5 w-3.5" /> Hotline: {phone}
            </a>
          )}
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${shortName} – Trang chủ`}>
          <BrandMark name={shortName} subtitle="Factory Supplies" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Chính">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                isActive(item.href) ? "text-brand-600" : "text-slate-700 hover:text-brand-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form action="/san-pham" className="relative hidden md:block">
            <input name="q" type="search" placeholder="Tìm sản phẩm…" className="input w-56 pr-9" aria-label="Tìm sản phẩm" />
            <Icon name="search" className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </form>
          <Link href="/lien-he" className="btn-primary hidden sm:inline-flex">
            Báo giá nhanh
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Đóng menu" : "Mở menu"}
          >
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page space-y-1 py-3">
            <form action="/san-pham" className="mb-2 md:hidden" onSubmit={() => setOpen(false)}>
              <input name="q" type="search" placeholder="Tìm sản phẩm…" className="input" aria-label="Tìm sản phẩm" />
            </form>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 font-semibold ${isActive(item.href) ? "bg-brand-50 text-brand-600" : "text-slate-700"}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 pt-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/san-pham?danh-muc=${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-1.5 text-sm text-slate-600"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

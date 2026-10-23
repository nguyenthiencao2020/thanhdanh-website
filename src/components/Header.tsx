"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "./BrandMark";
import { Icon } from "./Icon";

const nav = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/san-pham", label: "Sản phẩm", dropdown: true },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
];

type Props = {
  shortName: string;
  tagline: string | null;
  phone: string | null;
  phoneHref: string | null;
  email: string | null;
  zaloHref: string | null;
  facebook: string | null;
  categories: { slug: string; name: string; icon: string | null }[];
};

export function Header({ shortName, tagline, phone, phoneHref, email, zaloHref, facebook, categories }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) || (href === "/san-pham" && (pathname.startsWith("/danh-muc-san-pham") || pathname.startsWith("/thuong-hieu")));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* Top bar */}
      <div className="hidden bg-steel-900 text-xs text-steel-100 md:block">
        <div className="container-page flex h-9 items-center justify-between gap-4">
          <span className="truncate">{tagline}</span>
          <div className="flex shrink-0 items-center gap-5">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-white">
                <Icon name="mail" className="h-3.5 w-3.5" /> {email}
              </a>
            )}
            {zaloHref && (
              <a href={zaloHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">Zalo</a>
            )}
            {facebook && (
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
            )}
            {phone && phoneHref && (
              <a href={`tel:${phoneHref}`} className="flex items-center gap-1.5 font-semibold text-white hover:underline">
                <Icon name="phone" className="h-3.5 w-3.5" /> Hotline: {phone}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${shortName} – Trang chủ`}>
          <BrandMark name={shortName} subtitle="Factory Supplies" priority />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Chính">
          {nav.map((item) =>
            item.dropdown ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive(item.href) ? "text-brand-600" : "text-slate-700 hover:text-brand-600"
                  }`}
                >
                  {item.label}
                  <Icon name="arrow" className="h-3.5 w-3.5 rotate-90 transition group-hover:-rotate-90" />
                </Link>
                {/* Mega dropdown */}
                <div className="invisible absolute top-full left-1/2 w-[520px] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-steel-900/10">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/danh-muc-san-pham/${c.slug}`}
                        className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-600"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brand-600">
                          <Icon name={c.icon ?? "box"} className="h-5 w-5" />
                        </span>
                        {c.name}
                      </Link>
                    ))}
                    <div className="col-span-2 mt-1 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
                      <Link href="/san-pham" className="font-semibold text-steel-600 hover:text-brand-600">Tất cả sản phẩm →</Link>
                      <Link href="/thuong-hieu" className="font-semibold text-steel-600 hover:text-brand-600">Thương hiệu →</Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive(item.href) ? "text-brand-600" : "text-slate-700 hover:text-brand-600"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <form action="/tim-kiem" className="relative hidden xl:block">
            <input name="q" type="search" placeholder="Tìm sản phẩm, bài viết…" className="input w-56 pr-9" aria-label="Tìm kiếm" />
            <Icon name="search" className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </form>
          <Link href="/tim-kiem" className="rounded-md p-2 text-slate-700 hover:bg-slate-100 xl:hidden" aria-label="Tìm kiếm">
            <Icon name="search" className="h-5 w-5" />
          </Link>
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
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page space-y-1 py-3">
            <form action="/tim-kiem" className="mb-2" onSubmit={() => setOpen(false)}>
              <input name="q" type="search" placeholder="Tìm sản phẩm, bài viết…" className="input" aria-label="Tìm kiếm" />
            </form>
            {nav.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2 font-semibold ${isActive(item.href) ? "bg-brand-50 text-brand-600" : "text-slate-700"}`}
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="ml-3 border-l border-slate-200 pl-2">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/danh-muc-san-pham/${c.slug}`}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600"
                      >
                        {c.name}
                      </Link>
                    ))}
                    <Link href="/thuong-hieu" onClick={() => setOpen(false)} className="block rounded-md px-3 py-1.5 text-sm text-slate-600">
                      Thương hiệu
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

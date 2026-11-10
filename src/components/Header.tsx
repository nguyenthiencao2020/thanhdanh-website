"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "./BrandMark";
import { Icon } from "./Icon";
import { categoryThumb } from "@/lib/utils";
import Form from "next/form";

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
  /** Short promo line shown at the left of the top bar (Admin → Cài đặt → Thanh thông báo); falls back to the tagline. */
  announcement: string | null;
  announcementUrl: string | null;
  phone: string | null;
  phoneHref: string | null;
  email: string | null;
  zaloHref: string | null;
  facebook: string | null;
  /** Product groups that have products (empty ones are hidden), with their product count. */
  categories: { slug: string; name: string; icon: string | null; image_url?: string | null; count: number; children: { slug: string; name: string }[] }[];
  /** “Thương hiệu tiêu biểu” with their product count. */
  brands: { slug: string; name: string; logo_url: string | null; count: number }[];
};

export function Header({ shortName, tagline, announcement, announcementUrl, phone, phoneHref, email, zaloHref, facebook, categories, brands }: Props) {
  const [open, setOpen] = useState(false);
  // After choosing an item in the products mega menu, keep it closed until the pointer leaves
  // the menu — otherwise hover/focus would hold it open over the page that just loaded.
  const [megaDismissed, setMegaDismissed] = useState(false);
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
          {announcement ? (
            announcementUrl ? (
              <Link href={announcementUrl} className="flex min-w-0 items-center gap-2 hover:text-white">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-amber-300" />
                <span className="truncate font-medium">{announcement}</span>
              </Link>
            ) : (
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-amber-300" />
                <span className="truncate font-medium">{announcement}</span>
              </span>
            )
          ) : (
            <span className="truncate">{tagline}</span>
          )}
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
          <BrandMark name={shortName} variant="horizontal" priority />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Chính">
          {nav.map((item) =>
            item.dropdown ? (
              <div
                key={item.href}
                className={megaDismissed ? "" : "group"}
                onMouseLeave={() => setMegaDismissed(false)}
                onClickCapture={(e) => {
                  if ((e.target as HTMLElement).closest("a")) {
                    setMegaDismissed(true);
                    (document.activeElement as HTMLElement | null)?.blur();
                  }
                }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-semibold whitespace-nowrap transition xl:px-3 ${
                    isActive(item.href) ? "text-brand-600" : "text-slate-700 hover:text-brand-600"
                  }`}
                >
                  {item.label}
                  <Icon name="arrow" className="h-3.5 w-3.5 rotate-90 transition group-hover:-rotate-90" />
                </Link>
                {/* Mega dropdown: every group with its sub-categories */}
                {/* Only the panel (and the strip above it bridging from the menu item) takes the pointer,
                    so the menu closes as soon as the mouse leaves it. */}
                <div className="pointer-events-none invisible fixed top-[5.5rem] right-0 left-0 translate-y-2 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="container-page">
                    <div className="pointer-events-auto pt-10">
                    <div className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-steel-900/15">
                      {/* 1. Search by code */}
                      <div className="border-b border-slate-100 p-5">
                        <Form action="/san-pham" className="relative">
                          <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input name="q" type="search" placeholder="Nhập mã hàng hoặc tên sản phẩm…" aria-label="Tìm sản phẩm" className="input h-12 rounded-2xl pl-12 text-base" />
                        </Form>
                      </div>
                      <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
                        {/* 2. By brand */}
                        <div className="p-5 lg:border-r lg:border-slate-100">
                          <div className="mb-3 flex items-center justify-between px-1">
                            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">Chọn theo hãng</p>
                            <Link href="/thuong-hieu" className="text-xs font-semibold text-steel-600 hover:text-brand-600">Tất cả hãng →</Link>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {brands.map((b) => (
                              <Link
                                key={b.slug}
                                href={`/thuong-hieu/${b.slug}`}
                                className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-2 py-3 transition hover:border-brand-500 hover:shadow-md"
                              >
                                <span className="flex h-9 w-full items-center justify-center">
                                  {b.logo_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={b.logo_url} alt={b.name} loading="lazy" className="max-h-8 w-auto max-w-full object-contain" />
                                  ) : (
                                    <span className="text-sm font-extrabold text-steel-800">{b.name}</span>
                                  )}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">{b.count} SP</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                        {/* 3. By product type (only groups with products) */}
                        <div className="p-5">
                          <p className="mb-3 px-1 text-xs font-bold tracking-widest text-slate-500 uppercase">Hoặc theo loại hàng</p>
                          <div className="grid grid-cols-2 gap-1">
                            {categories.map((g) => (
                              <Link key={g.slug} href={`/danh-muc-san-pham/${g.slug}`} className="group/cat flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200">
                                  {g.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={categoryThumb(g.image_url)} alt="" loading="lazy" className="h-full w-full object-contain p-0.5" />
                                  ) : (
                                    <Icon name={g.icon ?? "box"} className="h-4 w-4 text-steel-600" />
                                  )}
                                </span>
                                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-steel-900 group-hover/cat:text-brand-600">{g.name}</span>
                                <span className="shrink-0 text-xs text-slate-500">{g.count}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-3xl border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm">
                        <Link href="/san-pham" className="font-semibold text-steel-700 hover:text-brand-600">Xem tất cả sản phẩm →</Link>
                        <span className="text-slate-500">
                          Không thấy mã hàng? <Link href="/lien-he" className="font-semibold text-brand-600 hover:underline">Gửi yêu cầu báo giá</Link>
                          {phone && phoneHref && <> hoặc gọi <a href={`tel:${phoneHref}`} className="font-semibold text-brand-600 hover:underline">{phone}</a></>}
                        </span>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-2.5 py-2 text-sm font-semibold whitespace-nowrap transition xl:px-3 ${
                  isActive(item.href) ? "text-brand-600" : "text-slate-700 hover:text-brand-600"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Form action="/tim-kiem" className="relative hidden xl:block">
            <input name="q" type="search" placeholder="Tìm sản phẩm…" className="input w-44 pr-9 2xl:w-56" aria-label="Tìm kiếm" />
            <Icon name="search" className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </Form>
          <Link href="/tim-kiem" className="rounded-md p-2 text-slate-700 hover:bg-slate-100 xl:hidden" aria-label="Tìm kiếm">
            <Icon name="search" className="h-5 w-5" />
          </Link>
          <Link href="/lien-he" className="btn-primary hidden whitespace-nowrap sm:inline-flex">
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
            <Form action="/tim-kiem" className="mb-2" onSubmit={() => setOpen(false)}>
              <input name="q" type="search" placeholder="Tìm sản phẩm, bài viết…" className="input" aria-label="Tìm kiếm" />
            </Form>
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
                  <div className="mt-1 mb-2 space-y-3 px-3">
                    <div>
                      <p className="mb-1.5 text-[11px] font-bold tracking-widest text-slate-500 uppercase">Theo hãng</p>
                      <div className="flex flex-wrap gap-1.5">
                        {brands.map((b) => (
                          <Link key={b.slug} href={`/thuong-hieu/${b.slug}`} onClick={() => setOpen(false)} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700">
                            {b.name}
                          </Link>
                        ))}
                        <Link href="/thuong-hieu" onClick={() => setOpen(false)} className="rounded-full px-3 py-1.5 text-sm font-semibold text-steel-600">Tất cả →</Link>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-bold tracking-widest text-slate-500 uppercase">Theo loại hàng</p>
                      {categories.map((g) => (
                        <Link key={g.slug} href={`/danh-muc-san-pham/${g.slug}`} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-md py-1.5 text-sm text-slate-700">
                          {g.name} <span className="text-xs text-slate-500">{g.count}</span>
                        </Link>
                      ))}
                    </div>
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

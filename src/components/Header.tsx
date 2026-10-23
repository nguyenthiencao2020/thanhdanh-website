"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "./BrandMark";
import { Icon } from "./Icon";
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
  categories: { slug: string; name: string; icon: string | null; description: string | null; children: { slug: string; name: string }[] }[];
};

export function Header({ shortName, tagline, announcement, announcementUrl, phone, phoneHref, email, zaloHref, facebook, categories }: Props) {
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

      <div className="container-page flex h-[72px] items-center justify-between gap-4 lg:h-24">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${shortName} – Trang chủ`}>
          <BrandMark name={shortName} priority />
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
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
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
                    <div className="pointer-events-auto pt-12">
                    <div className="grid max-h-[calc(100vh-9rem)] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-steel-900/15 lg:grid-cols-[1fr_280px]">
                      {/* Groups */}
                      <div className="p-5">
                        <div className="mb-3 flex items-center justify-between px-2">
                          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Danh mục sản phẩm</p>
                          <Link href="/san-pham" className="text-xs font-semibold text-steel-600 hover:text-brand-600">Xem tất cả →</Link>
                        </div>
                        <div className={`grid gap-1 ${categories.length > 8 ? "grid-cols-2 xl:grid-cols-3" : "grid-cols-2"}`}>
                          {categories.map((g) => (
                            <Link
                              key={g.slug}
                              href={`/danh-muc-san-pham/${g.slug}`}
                              className="group/cat flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-slate-50"
                            >
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-orange-50 text-brand-600 ring-1 ring-brand-100 transition group-hover/cat:from-brand-600 group-hover/cat:to-brand-500 group-hover/cat:text-white">
                                <Icon name={g.icon ?? "box"} className="h-5 w-5" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-bold text-steel-900 group-hover/cat:text-brand-600">{g.name}</span>
                                <span className="block truncate text-xs text-slate-500">
                                  {g.children.length > 0 ? g.children.map((c) => c.name).join(" · ") : g.description}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* Promo */}
                      <div className="relative isolate hidden flex-col justify-between overflow-hidden bg-steel-900 p-6 text-white lg:flex">
                        <div className="bg-blueprint absolute inset-0 -z-10" />
                        <div className="absolute -right-16 -bottom-16 -z-10 h-48 w-48 rounded-full bg-brand-600/40 blur-2xl" />
                        <div>
                          <p className="text-xs font-bold tracking-widest text-brand-100 uppercase">Báo giá nhanh</p>
                          <p className="mt-2 text-xl leading-snug font-bold">Không thấy mã hàng bạn cần?</p>
                          <p className="mt-2 text-sm text-steel-100/80">Gửi mã hoặc ảnh tem nhãn — chúng tôi tìm và báo giá cho bạn.</p>
                        </div>
                        <div className="mt-6 space-y-2.5">
                          {phone && phoneHref && (
                            <a href={`tel:${phoneHref}`} className="flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold backdrop-blur hover:bg-white/20">
                              <Icon name="phone" className="h-4 w-4" /> {phone}
                            </a>
                          )}
                          <Link href="/lien-he" className="btn-primary w-full">Gửi yêu cầu báo giá</Link>
                          <Link href="/thuong-hieu" className="block text-center text-xs font-semibold text-steel-100/80 hover:text-white">
                            Xem thương hiệu phân phối →
                          </Link>
                        </div>
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
          <Form action="/tim-kiem" className="relative hidden xl:block">
            <input name="q" type="search" placeholder="Tìm sản phẩm, bài viết…" className="input w-56 pr-9" aria-label="Tìm kiếm" />
            <Icon name="search" className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </Form>
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
                  <div className="ml-3 border-l border-slate-200 pl-2">
                    {categories.map((g) => (
                      <details key={g.slug} className="group/m">
                        <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-1.5 text-sm font-medium text-slate-700">
                          {g.name}
                          <Icon name="arrow" className="h-3.5 w-3.5 rotate-90 text-slate-400 transition group-open/m:-rotate-90" />
                        </summary>
                        <div className="mb-1 ml-3 border-l border-slate-100 pl-2">
                          <Link href={`/danh-muc-san-pham/${g.slug}`} onClick={() => setOpen(false)} className="block px-3 py-1 text-sm font-semibold text-brand-600">
                            Tất cả {g.name}
                          </Link>
                          {g.children.map((c) => (
                            <Link key={c.slug} href={`/danh-muc-san-pham/${c.slug}`} onClick={() => setOpen(false)} className="block px-3 py-1 text-sm text-slate-600">
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      </details>
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

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

export type SidebarBrand = { slug: string; name: string; lines: { slug: string; name: string }[] };

/**
 * Left menu of the product pages: brands, each opening to its product lines.
 * Desktop: sticky column. Phone: a button that opens the same list as a full-screen panel.
 */
export function LineSidebar({ brands, brand, line }: { brands: SidebarBrand[]; brand?: string; line?: string }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set([brand ?? brands[0]?.slug].filter(Boolean) as string[]));
  const [panel, setPanel] = useState(false);
  useEffect(() => {
    if (brand) setOpen((s) => (s.has(brand) ? s : new Set(s).add(brand)));
    setPanel(false);
  }, [brand, line]);
  useEffect(() => {
    document.body.style.overflow = panel ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);
  const toggle = (slug: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(slug)) n.delete(slug);
      else n.add(slug);
      return n;
    });

  const current = brands.find((b) => b.slug === brand);
  const currentLine = current?.lines.find((l) => l.slug === line);

  const list = (
    <nav aria-label="Hãng và dòng hàng" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <p className="border-b border-slate-100 bg-steel-900 px-4 py-3 text-sm font-bold tracking-wider text-white uppercase">Sản phẩm theo hãng</p>
      <ul className="divide-y divide-slate-100">
        {brands.map((b) => {
          const isOpen = open.has(b.slug);
          const active = b.slug === brand;
          return (
            <li key={b.slug}>
              <div className="flex items-center">
                <Link
                  scroll={false} href={`/thuong-hieu/${b.slug}`}
                  className={`flex min-w-0 flex-1 items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase transition ${
                    active && !line ? "bg-brand-50 text-brand-600" : active ? "text-brand-600" : "text-steel-900 hover:text-brand-600"
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  <span className="text-xs font-semibold text-slate-600">{b.lines.length}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggle(b.slug)}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? "Thu gọn" : "Mở"} ${b.name}`}
                  className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <Icon name="arrow" className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "-rotate-90" : "rotate-90"}`} />
                </button>
              </div>
              <div className={`grid transition-[grid-template-rows] duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0 overflow-hidden">
                  <ul className="pb-2">
                    {b.lines.map((l) => {
                      const on = active && l.slug === line;
                      return (
                        <li key={l.slug}>
                          <Link
                            scroll={false} href={`/thuong-hieu/${b.slug}/${l.slug}`}
                            className={`flex items-center gap-2 py-1.5 pr-4 pl-6 text-sm transition ${
                              on ? "bg-brand-50 font-semibold text-brand-600" : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${on ? "bg-brand-600" : "bg-slate-300"}`} />
                            {l.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm">
        <Link href="/lien-he" className="font-semibold text-brand-600 hover:underline">Không thấy hãng / mã cần? Gửi yêu cầu →</Link>
      </div>
    </nav>
  );

  return (
    <>
      {/* Phone: one button showing where you are */}
      <button
        type="button"
        onClick={() => setPanel(true)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 lg:hidden"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Icon name="menu" className="h-4 w-4 shrink-0" />
          <span className="truncate">
            Hãng &amp; dòng hàng{current ? `: ${current.name}` : ""}
            {currentLine ? ` › ${currentLine.name}` : ""}
          </span>
        </span>
        <Icon name="arrow" className="h-4 w-4 shrink-0 rotate-90 text-slate-400" />
      </button>
      {panel && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-50 p-4 pb-24 lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-lg font-bold text-steel-900">Hãng &amp; dòng hàng</p>
            <button type="button" onClick={() => setPanel(false)} className="rounded-lg p-2 hover:bg-slate-200" aria-label="Đóng">
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
          {list}
        </div>
      )}
      {/* Desktop: sticky left column */}
      <div className="hidden lg:sticky lg:top-28 lg:block lg:self-start">{list}</div>
    </>
  );
}

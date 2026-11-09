"use client";

import { useEffect, useRef } from "react";

/** Time of the last click on a brand/line link inside the product area (survives client navigations). */
let pendingAt = 0;

/**
 * Wraps the left menu + content of the product pages. Links in here use `scroll={false}`, so moving
 * between brands / product lines keeps the page where it is instead of jumping back to the hero.
 * After such a move, if the content's top is hidden above the header (or, on a phone, low on the screen),
 * glide it to just under the header.
 */
export function KeepScroll({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (Date.now() - pendingAt < 8000) {
      pendingAt = 0;
      const header = document.querySelector("header")?.getBoundingClientRect().height ?? 80;
      const target = header + 16;
      const top = el.getBoundingClientRect().top;
      if (top < target || (window.innerWidth < 1024 && top > window.innerHeight * 0.6)) window.scrollTo({ top: window.scrollY + top - target, behavior: "smooth" });
    }
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="/thuong-hieu/"]');
      if (a && el.contains(a)) pendingAt = Date.now();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

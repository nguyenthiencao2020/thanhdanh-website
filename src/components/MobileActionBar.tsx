"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

/** Mobile-only bottom bar (Gọi · Zalo · Báo giá) replacing the floating buttons on small screens. */
export function MobileActionBar({ phoneHref, zaloHref }: { phoneHref: string | null; zaloHref: string | null }) {
  const pathname = usePathname();
  // On a product page, "Báo giá" jumps to the quote form for that product.
  const quoteHref = pathname.startsWith("/san-pham/") ? "#bao-gia" : "/lien-he";
  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-semibold";
  return (
    <nav
      aria-label="Liên hệ nhanh"
      className="fixed inset-x-0 bottom-0 z-50 flex border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden"
    >
      {phoneHref && (
        <a href={`tel:${phoneHref}`} className={`${item} text-steel-700`}>
          <Icon name="phone" className="h-5 w-5" /> Gọi ngay
        </a>
      )}
      {zaloHref && (
        <a href={zaloHref} target="_blank" rel="noopener noreferrer" className={`${item} text-steel-700`}>
          <span className="flex h-5 items-center rounded bg-steel-500 px-1 text-[9px] font-bold text-white">Zalo</span> Chat Zalo
        </a>
      )}
      <Link href={quoteHref} className={`${item} m-1.5 rounded-xl bg-brand-600 text-white`}>
        <Icon name="mail" className="h-5 w-5" /> Báo giá
      </Link>
    </nav>
  );
}

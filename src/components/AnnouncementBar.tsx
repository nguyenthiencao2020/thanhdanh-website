"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";

/** Promo strip above the header; text and link come from Admin → Cài đặt. */
export function AnnouncementBar({ text, href }: { text: string; href: string | null }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const body = (
    <span className="inline-flex items-center gap-2">
      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase">Thông báo</span>
      {text}
      {href && <Icon name="arrow" className="h-3.5 w-3.5" />}
    </span>
  );
  return (
    <div className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-orange-500 text-sm font-medium text-white">
      <div className="container-page flex min-h-10 items-center justify-center py-2 pr-10 text-center">
        {href ? <Link href={href} className="hover:underline">{body}</Link> : body}
      </div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 hover:bg-white/15"
        aria-label="Đóng thông báo"
      >
        <Icon name="close" className="h-4 w-4" />
      </button>
    </div>
  );
}

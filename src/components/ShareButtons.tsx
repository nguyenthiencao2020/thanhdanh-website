"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent(url);
  const btn = "flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold transition hover:border-steel-500";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-slate-500">Chia sẻ:</span>
      <a className={`${btn} text-[#1877f2]`} href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener noreferrer">
        Facebook
      </a>
      <a className={`${btn} text-steel-600`} href={`https://sp.zalo.me/share_inline?u=${enc}`} target="_blank" rel="noopener noreferrer" title={title}>
        Zalo
      </a>
      <button
        type="button"
        className={`${btn} text-slate-700`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            /* clipboard unavailable */
          }
        }}
      >
        <Icon name={copied ? "check" : "box"} className="h-4 w-4" /> {copied ? "Đã sao chép" : "Sao chép link"}
      </button>
    </div>
  );
}

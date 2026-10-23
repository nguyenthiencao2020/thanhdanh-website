"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "./Icon";

/** Footer column: always open on desktop, collapsible (tap the title) on mobile. */
export function FooterCol({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-white/10 lg:border-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-bold tracking-wider text-white uppercase lg:pointer-events-none lg:py-0"
      >
        {title}
        <Icon name="arrow" className={`h-4 w-4 transition lg:hidden ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>
      <div className={`${open ? "block" : "hidden"} pb-4 lg:mt-4 lg:block lg:pb-0`}>{children}</div>
    </div>
  );
}

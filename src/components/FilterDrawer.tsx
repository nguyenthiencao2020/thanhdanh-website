"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

/** Sidebar on desktop; on mobile the same content opens from a “Bộ lọc” button as a full-screen panel. */
export function FilterDrawer({ children, summary }: { children: ReactNode; summary?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 lg:hidden"
      >
        <span className="flex items-center gap-2"><Icon name="menu" className="h-4 w-4" /> Bộ lọc</span>
        <span className="truncate pl-3 text-xs font-normal text-slate-500">{summary}</span>
      </button>
      <aside
        className={`${
          open ? "fixed inset-0 z-[60] block overflow-y-auto bg-slate-50 p-4 pb-24" : "hidden"
        } space-y-5 lg:static lg:sticky lg:top-36 lg:block lg:self-start lg:bg-transparent lg:p-0`}
      >
        {open && (
          <div className="flex items-center justify-between lg:hidden">
            <p className="text-lg font-bold text-steel-900">Bộ lọc</p>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-slate-200" aria-label="Đóng bộ lọc">
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
        )}
        <div onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>{children}</div>
      </aside>
    </>
  );
}

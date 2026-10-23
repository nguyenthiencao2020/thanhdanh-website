"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductWithRelations } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type Tab = { slug: string; name: string; items: ProductWithRelations[] };

/** One featured-products block with a tab per product group (replaces one block per group). */
export function ProductTabs({ all, tabs }: { all: ProductWithRelations[]; tabs: Tab[] }) {
  const [active, setActive] = useState("all");
  const current = active === "all" ? { slug: "", name: "Tất cả", items: all } : tabs.find((t) => t.slug === active)!;
  const href = current.slug ? `/danh-muc-san-pham/${current.slug}` : "/san-pham";

  return (
    <div>
      <div role="tablist" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ slug: "all", name: "Tất cả" }, ...tabs].map((t) => (
          <button
            key={t.slug}
            role="tab"
            type="button"
            aria-selected={active === t.slug}
            onClick={() => setActive(t.slug)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active === t.slug ? "border-steel-900 bg-steel-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-steel-500"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Mobile: horizontal scroll · Desktop: 4-column grid */}
      <div role="tabpanel" className="-mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-4">
        {current.items.slice(0, 8).map((p) => (
          <div key={p.id} className="w-60 shrink-0 snap-start sm:w-auto">
            <ProductCard product={p} hideBadge />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href={href} className="btn-outline px-6">
          Xem tất cả {current.slug ? current.name : "sản phẩm"} →
        </Link>
      </div>
    </div>
  );
}

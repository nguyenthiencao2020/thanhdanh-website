import Link from "next/link";
import type { CategoryNode } from "@/lib/types";
import { Icon } from "./Icon";

/**
 * Vertical "DANH MỤC SẢN PHẨM" menu next to the home slider (desktop), lqe.com.vn style:
 * hovering a group opens a flyout with its sub-categories.
 */
export function CategoryMenu({ tree }: { tree: CategoryNode[] }) {
  return (
    <nav
      aria-label="Danh mục sản phẩm"
      className="relative z-30 hidden flex-col rounded-3xl border border-slate-200 bg-white shadow-sm lg:flex"
    >
      <p className="flex items-center gap-2 rounded-t-3xl bg-brand-600 px-5 py-3.5 text-sm font-bold tracking-wide text-white uppercase">
        <Icon name="menu" className="h-5 w-5" /> Danh mục sản phẩm
      </p>
      <ul className="flex-1 py-1.5">
        {tree.map((g) => (
          <li key={g.slug} className="group/item">
            <Link
              href={`/danh-muc-san-pham/${g.slug}`}
              className="flex items-center gap-3 px-5 py-[7px] text-[13px] font-medium text-slate-700 transition group-hover/item:bg-brand-50 group-hover/item:text-brand-600"
            >
              <Icon name={g.icon ?? "box"} className="h-4 w-4 shrink-0 text-steel-500 group-hover/item:text-brand-600" />
              <span className="flex-1 truncate">{g.name}</span>
              {g.children.length > 0 && <Icon name="arrow" className="h-3.5 w-3.5 text-slate-300" />}
            </Link>
            {g.children.length > 0 && (
              <div className="invisible absolute top-0 left-full z-40 ml-2 min-h-full w-[560px] translate-x-2 rounded-3xl border border-slate-200 bg-white p-6 opacity-0 shadow-2xl shadow-steel-900/10 transition duration-200 group-hover/item:visible group-hover/item:translate-x-0 group-hover/item:opacity-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-steel-900">{g.name}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{g.children.length} danh mục</p>
                  </div>
                  {g.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.image_url} alt="" className="h-16 w-24 rounded-xl object-cover" />
                  )}
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-1">
                  {g.children.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/danh-muc-san-pham/${c.slug}`}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-brand-50 hover:text-brand-600"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/danh-muc-san-pham/${g.slug}`} className="mt-4 inline-flex text-sm font-semibold text-brand-600 hover:underline">
                  Xem tất cả {g.name} →
                </Link>
              </div>
            )}
          </li>
        ))}
      </ul>
      <Link href="/san-pham" className="rounded-b-3xl border-t border-slate-100 px-5 py-3 text-sm font-semibold text-steel-600 hover:text-brand-600">
        Tất cả sản phẩm →
      </Link>
    </nav>
  );
}
